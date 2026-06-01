import { startScraperJob } from './jobs/scrape.job';
import { facebookService } from './services/facebook.service';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--init-login')) {
    // Mode 1: Manual Login mode
    console.log("Starting Initial Login Mode...");
    await facebookService.init(true); // Headed mode
    try {
      await facebookService.loginAndSaveSession();
      console.log("Initial login complete. You can now close this and run normally.");
    } catch (e) {
      console.error("Error during initial login:", e);
    } finally {
      await facebookService.close();
      process.exit(0);
    }
  } else {
    // Mode 2: Normal Scheduler mode
    console.log("Starting Scraper Service in Scheduler mode...");
    startScraperJob();
    
    // Keep process alive
    process.on('SIGINT', async () => {
      console.log("Shutting down...");
      await facebookService.close();
      process.exit(0);
    });
  }
}

main().catch(console.error);
