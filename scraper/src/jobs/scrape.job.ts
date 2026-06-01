import cron from 'node-cron';
import { scraperService } from '../services/scraper.service';

const RETRY_DELAYS = [1 * 60 * 1000, 5 * 60 * 1000, 15 * 60 * 1000]; // 1m, 5m, 15m in milliseconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ========== Group Configuration ==========
const GROUPS = [
  { id: '489639048098084', name: 'ห้องข่าวทับสะแก' },
  { id: '2219391508348207', name: 'คนทับสะแก' },
  { id: 'lovethapsakae', name: 'คนรักทับสะแก' },
];

const TARGET_POSTS_PER_GROUP = 20;
const MAX_SCROLLS = 10;
// ==========================================

async function runWithRetry(groupId: string, groupName: string, attempt: number = 0) {
  try {
    await scraperService.runScraper(groupId, groupName, TARGET_POSTS_PER_GROUP, MAX_SCROLLS);
  } catch (error) {
    if (attempt < RETRY_DELAYS.length) {
      const delay = RETRY_DELAYS[attempt];
      console.log(`Attempt ${attempt + 1} failed for "${groupName}". Retrying in ${delay / 60000} minutes...`);
      await sleep(delay);
      await runWithRetry(groupId, groupName, attempt + 1);
    } else {
      console.error(`All ${RETRY_DELAYS.length} retry attempts failed for group "${groupName}".`);
    }
  }
}

export function startScraperJob() {
  console.log("Starting Scraper Job Scheduler...");
  console.log(`Configured groups: ${GROUPS.map(g => g.name).join(', ')}`);
  console.log(`Target: ~${TARGET_POSTS_PER_GROUP} posts per group, running every 2 hours\n`);

  const runScrapeSequence = async () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running scheduled scrape job at ${new Date().toLocaleString('th-TH')}`);
    console.log(`${'='.repeat(60)}`);

    for (const group of GROUPS) {
      console.log(`\n--- Starting scrape for: ${group.name} (${group.id}) ---`);
      await runWithRetry(group.id, group.name);
      // Wait between groups to avoid rate limiting
      await sleep(5000);
    }
    console.log(`\n✅ All groups scraped at ${new Date().toLocaleString('th-TH')}\n`);
  };

  // Run immediately on startup
  runScrapeSequence();

  // Schedule to run every 2 hours
  cron.schedule('0 */2 * * *', runScrapeSequence);

  console.log("Scheduler is active (runs every 2 hours).");
}
