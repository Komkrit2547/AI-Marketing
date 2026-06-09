import { facebookService } from './facebook.service';
import { postRepository } from '../repositories/post.repository';
import { cleanText, normalizeContent, detectTruncated } from '../utils/textCleaner';
import { generateHash } from '../utils/hashGenerator';

export class ScraperService {
  async runScraper(groupId: string, groupName: string, targetPosts: number = 20) {
    console.log(`Starting scrape for group: ${groupName} (${groupId})`);

    let postsFound = 0;
    let postsInserted = 0;
    let postsSkipped = 0;

    try {
      await facebookService.init(false);

      const scrapedData = await facebookService.scrapeGroup(groupId, targetPosts);
      postsFound = scrapedData.length;

      console.log(`Found ${postsFound} posts. Processing (target: ${targetPosts} new posts)...`);

      for (const data of scrapedData) {
        if (postsInserted >= targetPosts) {
          console.log(`  Reached target of ${targetPosts} new posts. Stopping.`);
          break;
        }

        const fullContent = normalizeContent(data.content);
        const previewContent = normalizeContent(data.contentPreview);
        if (!fullContent || fullContent.length < 20) {
          postsSkipped++;
          continue;
        }

        const isTruncated = detectTruncated(fullContent) || data.isTruncated;
        const contentHash = generateHash(fullContent, data.postedAt);

        if (isTruncated) {
          console.warn(`  ⚠️  Truncated content detected for post ${data.postId || 'unknown'}`);
        }

        const existingPost = await postRepository.findPostByHash(contentHash);

        if (!existingPost) {
          await postRepository.createPost({
            source: 'facebook',
            groupId,
            groupName,
            postId: data.postId || null,
            postUrl: data.postUrl || null,
            content: fullContent,
            contentPreview: previewContent || null,
            contentFull: data.contentFull || null,
            contentLength: data.contentLength,
            isTruncated,
            reactionCount: data.reactionCount,
            commentCount: data.commentCount,
            shareCount: data.shareCount,
            postedAt: data.postedAt,
            contentHash
          });
          postsInserted++;
          console.log(`  ✅ [${postsInserted}/${targetPosts}] Saved: "${fullContent.substring(0, 60)}..."`);
        } else {
          postsSkipped++;
          console.log(`  ⏭️  Duplicate skipped (hash: ${contentHash.substring(0, 8)}...)`);
        }
      }

      console.log(`\nScrape completed for "${groupName}". Inserted: ${postsInserted}, Skipped: ${postsSkipped}`);

      await postRepository.createScraperLog({
        status: 'success',
        postsFound,
        postsInserted
      });

    } catch (error: any) {
      console.error(`Scrape failed for "${groupName}": ${error.message}`);

      await postRepository.createScraperLog({
        status: 'error',
        postsFound,
        postsInserted
      });

      throw error;
    } finally {
      await facebookService.close();
    }
  }
}

export const scraperService = new ScraperService();
