import dotenv from 'dotenv';
dotenv.config();

import { facebookService } from './services/facebook.service';
import { postRepository } from './repositories/post.repository';
import { normalizeContent, detectTruncated } from './utils/textCleaner';
import { generateHash } from './utils/hashGenerator';

// ========== Group Configuration ==========
const GROUPS = [
  { id: '489639048098084', name: 'ห้องข่าวทับสะแก' },
  { id: '2219391508348207', name: 'คนทับสะแก' },
  { id: 'lovethapsakae', name: 'คนรักทับสะแก' },
];

const TARGET_POSTS_PER_GROUP = 20;
const MAX_SCROLLS = 10;
// ==========================================

async function testScrape() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Starting Scraper Test`);
  console.log(`   Groups: ${GROUPS.length}`);
  console.log(`   Target: ${TARGET_POSTS_PER_GROUP} posts per group`);
  console.log(`   Max scrolls: ${MAX_SCROLLS}`);
  console.log(`${'='.repeat(60)}\n`);

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalFound = 0;

  for (const group of GROUPS) {
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`📜 Scraping: "${group.name}" (${group.id})`);
    console.log(`${'─'.repeat(50)}`);

    try {
      console.log('🌐 Opening Browser...');
      await facebookService.init(false);

      const scrapedPosts = await facebookService.scrapeGroup(group.id, MAX_SCROLLS);
      totalFound += scrapedPosts.length;
      console.log(`\n📊 Posts found: ${scrapedPosts.length}`);

      let inserted = 0;
      let skipped = 0;

      for (const post of scrapedPosts) {
        if (inserted >= TARGET_POSTS_PER_GROUP) break;

        const fullContent = normalizeContent(post.content);
        if (!fullContent || fullContent.length < 20) {
          skipped++;
          continue;
        }

        const isTruncated = detectTruncated(fullContent) || post.isTruncated;
        const contentHash = generateHash(fullContent, post.postedAt);

        const existing = await postRepository.findPostByHash(contentHash);
        if (existing) {
          skipped++;
          console.log(`  ⏭️  Duplicate skipped (hash: ${contentHash.substring(0, 8)}...)`);
          continue;
        }

        await postRepository.createPost({
          source: 'facebook',
          groupId: group.id,
          groupName: group.name,
          postId: post.postId || null,
          postUrl: post.postUrl || null,
          content: fullContent,
          contentPreview: post.contentPreview || null,
          contentFull: post.contentFull || null,
          contentLength: post.contentLength,
          isTruncated,
          postedAt: post.postedAt,
          contentHash,
        });

        inserted++;
        console.log(`  ✅ [${inserted}/${TARGET_POSTS_PER_GROUP}] Saved (${post.contentLength} chars) - "${fullContent.substring(0, 60)}..."`);
      }

      await postRepository.createScraperLog({
        status: 'success',
        postsFound: scrapedPosts.length,
        postsInserted: inserted,
      });

      totalInserted += inserted;
      totalSkipped += skipped;

      console.log(`\n📈 "${group.name}" Summary: Saved ${inserted}, Skipped ${skipped}`);

    } catch (error: any) {
      console.error(`\n❌ Error scraping "${group.name}": ${error.message}`);

      await postRepository.createScraperLog({
        status: 'error',
        postsFound: 0,
        postsInserted: 0,
      });
    } finally {
      await facebookService.close();
    }

    // Wait between groups
    if (GROUPS.indexOf(group) < GROUPS.length - 1) {
      console.log('\n⏳ Waiting 5 seconds before next group...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏁 All Groups Complete!`);
  console.log(`   Total posts found: ${totalFound}`);
  console.log(`   Total newly saved: ${totalInserted}`);
  console.log(`   Total skipped: ${totalSkipped}`);
  console.log(`${'='.repeat(60)}\n`);

  await postRepository.disconnect();
  console.log('🔒 Database closed');
  process.exit(0);
}

testScrape();
