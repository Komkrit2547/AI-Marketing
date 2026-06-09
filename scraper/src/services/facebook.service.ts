import { chromium, Browser, BrowserContext, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const SESSION_FILE = path.join(__dirname, '../../facebook-session.json');

// ========== Browser Fingerprint ==========
// ใช้ User-Agent เดียวกันทั้ง login และ scrape
// เพื่อไม่ให้ Facebook สงสัยว่า session ถูกใช้จากคนละเครื่อง
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const BROWSER_LOCALE = 'th-TH';
const BROWSER_TIMEZONE = 'Asia/Bangkok';
// ==========================================

export interface ScrapedPost {
  postId?: string;
  postUrl?: string;
  content: string;
  contentPreview: string;
  contentFull: string;
  contentLength: number;
  isTruncated: boolean;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  postedAt: Date | null;
}

export class FacebookService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async init(headed: boolean = false) {
    if (headed) {
      // โหมด Login: ใช้ Chrome จริง + ซ่อนสัญญาณ automation ทั้งหมด
      // เพื่อหลีกเลี่ยง reCAPTCHA ที่ Facebook ใช้ตรวจจับบอท
      this.browser = await chromium.launch({
        headless: false,
        channel: 'chrome',
        // ลบ --enable-automation flag ที่ทำให้ navigator.webdriver = true
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
          '--disable-blink-features=AutomationControlled',
          '--disable-infobars',
          '--no-first-run',
        ],
      });
    } else {
      // โหมด Scraping: ใช้ Playwright Chromium (ทำงานใน Docker ได้)
      this.browser = await chromium.launch({
        headless: true,
        args: ['--disable-blink-features=AutomationControlled'],
      });
    }

    const contextOptions = {
      viewport: { width: 1280, height: 720 },
      userAgent: BROWSER_USER_AGENT,
      locale: BROWSER_LOCALE,
      timezoneId: BROWSER_TIMEZONE,
    };

    if (fs.existsSync(SESSION_FILE) && !headed) {
      this.context = await this.browser.newContext({
        ...contextOptions,
        storageState: SESSION_FILE,
      });
    } else {
      this.context = await this.browser.newContext(contextOptions);
    }

    this.page = await this.context.newPage();

    // ซ่อน navigator.webdriver ทั้งโหมด login และ scrape
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    // โหมด Login: ตั้ง timeout ไม่จำกัดเพื่อให้ผู้ใช้มีเวลา login เพียงพอ
    if (headed) {
      this.page.setDefaultTimeout(0);
    }
  }

  async loginAndSaveSession() {
    if (!this.page || !this.context) throw new Error("Browser not initialized");

    console.log("Navigating to Facebook login page...");
    await this.page.goto('https://www.facebook.com/');

    console.log("Please login manually in the opened browser window.");
    console.log("After login, we will wait for the home feed to fully load...\n");

    // รอจนกว่า c_user cookie จะถูกสร้าง (= ล็อกอินสำเร็จจริง)
    // timeout: 0 = รอได้ไม่จำกัดเวลา
    await this.page.waitForFunction(() => {
      return document.cookie.includes('c_user');
    }, { timeout: 0, polling: 2000 });

    // รอเพิ่มอีก 5 วินาทีให้ Facebook set cookie อื่นๆ ให้ครบ
    console.log("Login detected! Waiting for cookies to stabilize...");
    await this.page.waitForTimeout(5000);

    console.log("Saving session...");
    await this.context.storageState({ path: SESSION_FILE });

    // ตรวจสอบว่า session มี cookie ที่จำเป็นครบ
    const cookies = await this.context.cookies();
    const cookieNames = cookies.map(c => c.name);
    const required = ['c_user', 'xs', 'datr'];
    const missing = required.filter(n => !cookieNames.includes(n));

    if (missing.length > 0) {
      console.warn(`⚠️  WARNING: Missing critical cookies: ${missing.join(', ')}`);
      console.warn(`   Session may not work for scraping.`);
    } else {
      console.log(`✅ Session saved with all critical cookies (${cookies.length} total)`);
    }
    console.log(`   File: ${SESSION_FILE}`);
  }

  /**
   * Validate that the current session is still logged in.
   */
  async validateSession(): Promise<boolean> {
    if (!this.page) throw new Error("Browser not initialized");

    console.log('🔍 Validating Facebook session...');
    await this.page.goto('https://www.facebook.com/', {
      waitUntil: 'domcontentloaded', timeout: 30000,
    });
    await this.page.waitForTimeout(3000);

    // ตรวจสอบว่ายังล็อกอินอยู่
    const isLoggedIn = await this.page.evaluate(() => {
      // ถ้ามีฟอร์มล็อกอิน = ยังไม่ได้ล็อกอิน
      const loginForm = document.querySelector('form[action*="login"]');
      if (loginForm) return false;
      // ถ้ามี navigation bar ของผู้ใช้ = ล็อกอินอยู่
      const nav = document.querySelector('[role="navigation"]');
      return !!nav;
    });

    if (!isLoggedIn) {
      console.error('❌ Session expired! Please run: npm run init-login');
      return false;
    }

    console.log('✅ Session is valid');
    return true;
  }

  /**
   * Expand "See more" / "ดูเพิ่มเติม" buttons ONLY within the main post content.
   * Scoped to the first [role="article"] to avoid expanding comments.
   */
  private async expandPostSeeMore(page: Page): Promise<number> {
    let totalClicked = 0;
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let clickedInRound = 0;

      // Only target "See more" buttons inside the FIRST article (the main post)
      // Avoid expanding comment "See more" buttons
      const firstArticle = page.locator('[role="article"]').first();
      const buttons = firstArticle.locator('div[role="button"], span[role="button"]').filter({
        hasText: /^(See more|ดูเพิ่มเติม)$/
      });

      const count = await buttons.count().catch(() => 0);
      if (count === 0) break;

      for (let i = 0; i < count; i++) {
        try {
          const btn = buttons.nth(i);
          if (await btn.isVisible().catch(() => false)) {
            await btn.click({ timeout: 3000, force: true });
            clickedInRound++;
            await page.waitForTimeout(500);
          }
        } catch {
          // Ignore click failures
        }
      }

      totalClicked += clickedInRound;
      if (clickedInRound === 0) break;

      await page.waitForTimeout(1000);
    }

    return totalClicked;
  }

  /**
   * Clean up Facebook UI text from extracted content.
   */
  private cleanContent(raw: string): string {
    return raw
      .replace(/\.\.\.[\s]*ดูเพิ่มเติม/g, '')
      .replace(/…[\s]*ดูเพิ่มเติม/g, '')
      .replace(/See more|ดูเพิ่มเติม/g, '')
      .replace(/See less|ดูน้อยลง/g, '')
      .replace(/\.\.\.$/g, '')
      .replace(/…$/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  /**
   * Extract the actual post content from a single post page.
   * Opens in a clean new tab to avoid Facebook SPA overlay issues.
   */
  private async extractContentFromPostUrl(url: string): Promise<{ content: string; contentRaw: string; reactionCount: number; commentCount: number; shareCount: number }> {
    if (!this.context) throw new Error("Browser not initialized");

    const postPage = await this.context.newPage();

    try {
      await postPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Check if redirected to login
      if (postPage.url().includes('login')) {
        console.warn(`  ⚠️  Session expired, cannot open post`);
        return { content: '', contentRaw: '', reactionCount: 0, commentCount: 0, shareCount: 0 };
      }

      // Wait for content to render
      await postPage.waitForTimeout(2500);

      // Expand "See more" only in the main post
      const expanded = await this.expandPostSeeMore(postPage);
      if (expanded > 0) {
        console.log(`    Expanded ${expanded} "See more" in post`);
        await postPage.waitForTimeout(1000);
      }

      // Extract content from the page
      const extracted = await postPage.evaluate(() => {
        // Strategy 1: Look for the post content in a dialog (Facebook renders single posts in dialogs)
        const dialog = document.querySelector('[role="dialog"]');
        // Strategy 2: Look in the main content area
        const main = document.querySelector('[role="main"]');
        // Use dialog if it exists, otherwise use main
        const container = dialog || main || document;

        // Find the first article element — this is the main post
        const article = container.querySelector('[role="article"]');
        if (!article) return { text: '', reactionCount: 0, commentCount: 0, shareCount: 0 };

        // --- Content extraction (existing logic) ---
        let extractedText = '';

        // Try 1: data-ad-comet-preview="message" — Facebook's standard post text container
        const cometMsg = article.querySelector('div[data-ad-comet-preview="message"]');
        if (cometMsg) {
          const text = (cometMsg as HTMLElement).innerText || '';
          if (text.length > 5) extractedText = text;
        }

        if (!extractedText) {
          // Try 2: data-ad-preview="message" — older Facebook format
          const adMsg = article.querySelector('[data-ad-preview="message"]');
          if (adMsg) {
            const text = (adMsg as HTMLElement).innerText || '';
            if (text.length > 5) extractedText = text;
          }
        }

        if (!extractedText) {
          // Try 3: Find div[dir="auto"] elements that are part of the post content.
          const dirDivs = Array.from(article.querySelectorAll('div[dir="auto"]'));

          const topLevelDirDivs = dirDivs.filter(div => {
            let parent = div.parentElement;
            while (parent && parent !== article) {
              if (parent.getAttribute('dir') === 'auto' && parent.tagName === 'DIV') {
                return false;
              }
              parent = parent.parentElement;
            }
            return true;
          });

          for (const div of topLevelDirDivs) {
            const text = (div as HTMLElement).innerText || '';
            if (text.length > 10 && !div.querySelector('h1,h2,h3,h4')) {
              extractedText = text;
              break;
            }
          }
        }

        if (!extractedText) {
          const allTexts: string[] = [];
          const dirDivs2 = Array.from(article.querySelectorAll('div[dir="auto"]'));
          const topLevel2 = dirDivs2.filter(div => {
            let parent = div.parentElement;
            while (parent && parent !== article) {
              if (parent.getAttribute('dir') === 'auto' && parent.tagName === 'DIV') {
                return false;
              }
              parent = parent.parentElement;
            }
            return true;
          });
          for (const div of topLevel2) {
            const text = (div as HTMLElement).innerText || '';
            if (text.length > 5) allTexts.push(text);
          }
          if (allTexts.length > 0) extractedText = allTexts.join('\n');
        }

        // --- Engagement metrics extraction ---
        function parseFBNum(s: string): number {
          const t = s.trim().replace(/,/g, '');
          const en = t.match(/^([\d.]+)\s*([KM])?/i);
          if (en) {
            let v = parseFloat(en[1]);
            if (en[2]) {
              if (en[2].toUpperCase() === 'K') v *= 1000;
              if (en[2].toUpperCase() === 'M') v *= 1000000;
            }
            return Math.round(v);
          }
          const thaiUnits: [string, number][] = [['หมื่น', 10000], ['แสน', 100000], ['ล้าน', 1000000]];
          for (const [unit, mult] of thaiUnits) {
            const m = t.match(new RegExp(`^([\\d.]+)\\s*${unit}`));
            if (m) return Math.round(parseFloat(m[1]) * mult);
          }
          if (/^\d+$/.test(t)) return parseInt(t, 10);
          return 0;
        }

        let reactionCount = 0, commentCount = 0, shareCount = 0;
        
        // 1. Primary Strategy: Check elements with aria-label (Facebook heavily relies on this for accessibility)
        const ariaEls = Array.from(article.querySelectorAll('*[aria-label]'));
        for (const el of ariaEls) {
          const aria = el.getAttribute('aria-label') || '';
          if (!aria) continue;

          let m = aria.match(/(?:ถูกใจ.*?|ความรู้สึก.*?|reactions?.*?)?(\d[\d.,]*[KkMmหมื่นแสนล้าน]*)\s*(?:คน|รายการ|reactions?|ความรู้สึก|ถูกใจ)/i);
          if (m && reactionCount === 0) reactionCount = parseFBNum(m[1]);
          
          m = aria.match(/(?:ความคิดเห็น\s*)?(\d[\d.,]*[KkMmหมื่นแสนล้าน]*)\s*(?:รายการ|comments?|ความคิดเห็น)/i);
          if (m && commentCount === 0) commentCount = parseFBNum(m[1]);
          
          m = aria.match(/(?:แชร์\s*)?(\d[\d.,]*[KkMmหมื่นแสนล้าน]*)\s*(?:ครั้ง|shares?|แชร์)/i);
          if (m && shareCount === 0) shareCount = parseFBNum(m[1]);
        }

        // 2. Fallback Strategy: Check interactive elements text
        if (reactionCount === 0 || commentCount === 0 || shareCount === 0) {
          const textEls = Array.from(article.querySelectorAll('span[dir="auto"], div[role="button"]'));
          for (const el of textEls) {
            const txt = (el as HTMLElement).innerText?.trim() || '';
            if (!txt || txt.length > 50) continue;

            let m: RegExpMatchArray | null;

            if (reactionCount === 0) {
              m = txt.match(/(?:ถูกใจ.*?|ความรู้สึก.*?|reactions?.*?)?(\d[\d.,]*[KkMmหมื่นแสนล้าน]*)\s*(?:คน|รายการ|reactions?|ความรู้สึก|ถูกใจ)/i);
              if (m) reactionCount = parseFBNum(m[1]);
            }
            if (commentCount === 0) {
              m = txt.match(/(?:ความคิดเห็น\s*)?(\d[\d.,]*[KkMmหมื่นแสนล้าน]*)\s*(?:รายการ|comments?|ความคิดเห็น)/i);
              if (m && /comment|ความคิดเห็น/i.test(txt)) commentCount = parseFBNum(m[1]);
            }
            if (shareCount === 0) {
              m = txt.match(/(?:แชร์\s*)?(\d[\d.,]*[KkMmหมื่นแสนล้าน]*)\s*(?:ครั้ง|shares?|แชร์)/i);
              if (m && /share|แชร์/i.test(txt) && !/เมื่อ/i.test(txt)) shareCount = parseFBNum(m[1]);
            }
          }
        }
        
        // Final fallback: if we still don't have them, analyze the raw innerText lines
        // Facebook often renders the engagement row simply as numbers right above the comment section header
        if (reactionCount === 0 || commentCount === 0 || shareCount === 0) {
           const lines = (article as HTMLElement).innerText?.split('\n').map(l => l.trim()).filter(l => l) || [];
           
           // Find the comment section header
           const headerIdx = lines.findIndex(l => /เกี่ยวข้องมากที่สุด|ความคิดเห็นทั้งหมด|Most relevant|All comments/i.test(l));
           if (headerIdx > 0) {
              // The numbers above the header are usually the engagement metrics
              // Order is usually: [Reactions], [Comments], [Shares]
              // But if there's no shares, it's just [Reactions], [Comments]
              // Let's grab up to 3 lines above the header
              const metricsLines = [];
              for (let i = headerIdx - 1; i >= Math.max(0, headerIdx - 3); i--) {
                 if (/^[\d.,]+[KkMmหมื่นแสนล้าน]*$/.test(lines[i])) {
                    metricsLines.unshift(lines[i]);
                 } else {
                    break; // Stop if we hit something that is not just a number
                 }
              }
              
              if (metricsLines.length > 0) {
                 if (metricsLines.length === 1) {
                    // Only 1 number: it could be just reactions or just comments.
                    // If reaction is already found, this is comments.
                    if (reactionCount > 0 && commentCount === 0) commentCount = parseFBNum(metricsLines[0]);
                    else if (reactionCount === 0) reactionCount = parseFBNum(metricsLines[0]);
                 } else if (metricsLines.length === 2) {
                    if (reactionCount === 0) reactionCount = parseFBNum(metricsLines[0]);
                    if (commentCount === 0) commentCount = parseFBNum(metricsLines[1]);
                 } else if (metricsLines.length >= 3) {
                    if (reactionCount === 0) reactionCount = parseFBNum(metricsLines[0]);
                    if (commentCount === 0) commentCount = parseFBNum(metricsLines[1]);
                    if (shareCount === 0) shareCount = parseFBNum(metricsLines[2]);
                 }
              }
           }
        }
        
        // Debug logging: return the raw text blocks we analyzed if we failed to find comments or shares
        let debugTexts = '';
        if (commentCount === 0 || shareCount === 0) {
           const lines = (article as HTMLElement).innerText?.split('\n').map(l => l.trim()).filter(l => l).join(' | ') || '';
           debugTexts = `[lines: ${lines.substring(0, 300)}...]`;
        }

        return { text: extractedText, reactionCount, commentCount, shareCount, debugTexts };
      });

      const cleaned = this.cleanContent(extracted.text);
      if (extracted.debugTexts) {
         console.log(`    ⚠️ DEBUG DUMP for post: ${extracted.debugTexts.substring(0, 500)}...`);
      }
      return {
        content: cleaned,
        contentRaw: extracted.text,
        reactionCount: extracted.reactionCount,
        commentCount: extracted.commentCount,
        shareCount: extracted.shareCount
      };

    } catch (err: any) {
      console.warn(`    ⚠️  Error extracting from post page: ${err.message}`);
      return { content: '', contentRaw: '', reactionCount: 0, commentCount: 0, shareCount: 0 };
    } finally {
      await postPage.close();
    }
  }

  /**
   * Extract post URLs from the group feed.
   * Only collects URLs — content will be extracted from individual post pages.
   */
  private async extractPostUrlsFromFeed(page: Page): Promise<Map<string, { previewContent: string; url: string }>> {
    const results = await page.evaluate(() => {
      const items: { previewContent: string; url: string }[] = [];

      const feedElement = document.querySelector('[role="feed"]');
      if (!feedElement) return items;

      const articleElements = feedElement.querySelectorAll(':scope > div');

      articleElements.forEach((postContainer: any) => {
        // Find the post URL — take the FIRST matching link (timestamp link)
        let url = '';
        const links = Array.from(postContainer.querySelectorAll('a[href]'));
        for (const a of links) {
          const href = (a as any).href || '';
          if (href.includes('/groups/') && (href.includes('/posts/') || href.includes('/permalink/'))) {
            url = href.split('?')[0];
            break;
          }
        }

        if (!url) return;

        // Get a brief preview for logging only (not used for matching)
        let previewContent = '';
        const messageEl = postContainer.querySelector('div[data-ad-comet-preview="message"]') || postContainer.querySelector('[data-ad-preview="message"]');
        if (messageEl) {
          previewContent = (messageEl.innerText || '').substring(0, 200);
        }
        if (!previewContent) {
          const firstDir = postContainer.querySelector('div[dir="auto"]');
          if (firstDir) {
            previewContent = (firstDir.innerText || '').substring(0, 200);
          }
        }

        items.push({ previewContent, url });
      });

      return items;
    });

    // Deduplicate by URL
    const postsMap = new Map<string, { previewContent: string; url: string }>();
    for (const post of results) {
      if (post.url && !postsMap.has(post.url)) {
        postsMap.set(post.url, post);
      }
    }

    return postsMap;
  }

  /**
   * Random delay to mimic human behavior.
   */
  private async randomDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    await this.page!.waitForTimeout(delay);
  }

  /**
   * Scroll the page using randomized human-like methods.
   */
  private async humanScroll(page: Page): Promise<void> {
    const method = Math.random();
    if (method < 0.4) {
      // วิธีที่ 1: Mouse wheel (เหมือนเลื่อน scroll wheel)
      await page.mouse.wheel(0, Math.floor(800 + Math.random() * 1200));
    } else if (method < 0.7) {
      // วิธีที่ 2: กดปุ่ม End (เหมือนกดคีย์บอร์ด)
      await page.keyboard.press('End');
    } else {
      // วิธีที่ 3: Scroll ไปที่ element สุดท้ายใน feed
      await page.evaluate(() => {
        const feed = document.querySelector('[role="feed"]');
        if (feed && feed.lastElementChild) {
          feed.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, document.body.scrollHeight);
        }
      });
    }
  }

  async scrapeGroup(groupId: string, targetPosts: number = 20, maxScrolls: number = 40): Promise<ScrapedPost[]> {
    if (!this.page || !this.context) throw new Error("Browser not initialized");

    const groupUrl = `https://www.facebook.com/groups/${groupId}`;
    console.log(`Navigating to group: ${groupUrl}`);

    await this.page.goto(groupUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    if (this.page.url().includes('login')) {
      throw new Error("Session Expired: Redirected to login page. Please re-authenticate.");
    }

    console.log("Waiting for feed to load...");
    try {
      await this.page.waitForSelector('[role="feed"]', { timeout: 15000 });
    } catch (e) {
      console.warn("Feed selector not found within timeout. Attempting to proceed anyway...");
    }

    // Stage 1: Adaptive scrolling จนกว่าจะได้ URL เพียงพอ
    const allPostsMap = new Map<string, { previewContent: string; url: string }>();
    let scrollCount = 0;
    let staleCount = 0;
    const targetUrls = targetPosts + 5; // เผื่อ buffer สำหรับโพสต์ที่ถูก skip

    console.log(`Stage 1: Collecting at least ${targetUrls} post URLs (target: ${targetPosts} posts)...`);

    while (allPostsMap.size < targetUrls && scrollCount < maxScrolls) {
      const prevSize = allPostsMap.size;

      const currentPosts = await this.extractPostUrlsFromFeed(this.page);
      for (const [key, post] of currentPosts) {
        if (!allPostsMap.has(key)) {
          allPostsMap.set(key, post);
        }
      }

      scrollCount++;
      console.log(`  Scroll ${scrollCount} - ${allPostsMap.size} unique URLs (target: ${targetUrls})`);

      // Stale detection: ถ้าเลื่อน 3 ครั้งแล้ว URL ไม่เพิ่ม = feed หมดแล้ว
      if (allPostsMap.size === prevSize) {
        staleCount++;
        if (staleCount >= 3) {
          console.log(`  ⚠️ No new posts after ${staleCount} consecutive scrolls. Feed may be exhausted.`);
          break;
        }
      } else {
        staleCount = 0;
      }

      // Human-like scroll + random delay
      await this.humanScroll(this.page);
      await this.randomDelay(2000, 5000);
    }

    console.log(`Stage 1 complete. ${allPostsMap.size} URLs collected after ${scrollCount} scrolls.`);

    // Stage 2: Open each post in a NEW TAB and extract full content
    const scrapedPosts: ScrapedPost[] = [];
    let processedCount = 0;

    for (const [url, feedPost] of allPostsMap) {
      processedCount++;
      console.log(`  [${processedCount}/${allPostsMap.size}] Opening: ${url}`);

      // Extract post ID from URL
      let postId: string | undefined;
      const parts = url.split('/').filter(p => p);
      const postIdCandidate = parts[parts.length - 1] || parts[parts.length - 2];
      if (postIdCandidate && !isNaN(Number(postIdCandidate))) {
        postId = postIdCandidate;
      } else {
        // Try second to last
        const alt = parts[parts.length - 2];
        if (alt && !isNaN(Number(alt))) {
          postId = alt;
        }
      }

      // Open post in a new tab for clean extraction
      const { content, contentRaw, reactionCount, commentCount, shareCount } = await this.extractContentFromPostUrl(url);

      const finalContent = content || this.cleanContent(feedPost.previewContent);
      const contentLength = finalContent.length;
      const isTruncated = /See more\s*$|ดูเพิ่มเติม\s*$/m.test(finalContent.trim());

      if (isTruncated) {
        console.warn(`    ⚠️  Content still appears truncated for post ${postId}`);
      }

      console.log(`    ✔ postId: ${postId}, contentLength: ${contentLength}, reactions: ${reactionCount}, comments: ${commentCount}, shares: ${shareCount}, preview: "${finalContent.substring(0, 60)}..."`);

      scrapedPosts.push({
        postId,
        postUrl: url,
        content: finalContent,
        contentPreview: feedPost.previewContent,
        contentFull: contentRaw || finalContent,
        contentLength,
        isTruncated,
        reactionCount,
        commentCount,
        shareCount,
        postedAt: new Date()
      });

      // หน่วงเวลาระหว่างแต่ละโพสต์เพื่อลด rate limiting
      await this.randomDelay(1000, 2000);
    }

    console.log(`Stage 2 complete. ${scrapedPosts.length} posts processed with full content extraction.`);
    return scrapedPosts;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export const facebookService = new FacebookService();
