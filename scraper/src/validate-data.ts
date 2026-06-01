import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.communityPost.findMany({
    orderBy: { contentLength: 'desc' }
  });

  console.log(`\n${'='.repeat(80)}`);
  console.log('VALIDATION REPORT');
  console.log(`${'='.repeat(80)}`);

  // 1. Overall stats
  const totalPosts = posts.length;
  const avgLength = totalPosts > 0 ? Math.round(posts.reduce((s, p) => s + p.contentLength, 0) / totalPosts) : 0;
  const maxLength = totalPosts > 0 ? Math.max(...posts.map(p => p.contentLength)) : 0;
  const minLength = totalPosts > 0 ? Math.min(...posts.map(p => p.contentLength)) : 0;
  const truncatedCount = posts.filter(p => p.isTruncated).length;
  const havePreview = posts.filter(p => p.contentPreview).length;
  const haveFull = posts.filter(p => p.contentFull).length;

  console.log(`\n📊 CONTENT QUALITY STATISTICS`);
  console.log(`${'-'.repeat(40)}`);
  console.log(`Total Posts Scraped:       ${totalPosts}`);
  console.log(`Average Content Length:    ${avgLength} chars`);
  console.log(`Longest Post Length:       ${maxLength} chars`);
  console.log(`Shortest Post Length:      ${minLength} chars`);
  console.log(`Truncated Posts Count:     ${truncatedCount}`);
  console.log(`With contentPreview:       ${havePreview}`);
  console.log(`With contentFull:          ${haveFull}`);

  // 2. Preview vs Full content comparison (top 10 by length)
  console.log(`\n\n📋 PREVIEW vs FULL CONTENT COMPARISON`);
  console.log(`${'='.repeat(80)}`);

  for (let i = 0; i < Math.min(10, posts.length); i++) {
    const p = posts[i];
    const previewLen = p.contentPreview ? p.contentPreview.length : 0;

    console.log(`\n${'─'.repeat(80)}`);
    console.log(`POST ${i + 1} - ID: ${p.postId}`);
    console.log(`URL: ${p.postUrl}`);
    console.log(`${'─'.repeat(80)}`);
    console.log(`Content Length: ${p.contentLength} chars`);
    console.log(`Preview Length: ${previewLen} chars`);
    console.log(`Difference:     ${p.contentLength - previewLen} chars`);
    console.log(`Is Truncated:   ${p.isTruncated}`);
    console.log(`${'─'.repeat(80)}`);

    if (p.contentPreview) {
      console.log(`\n📝 CONTENT PREVIEW:`);
      console.log(p.contentPreview.substring(0, 300) + (p.contentPreview.length > 300 ? '...' : ''));
    } else {
      console.log(`\n📝 CONTENT PREVIEW: (not available)`);
    }
    console.log(`\n📝 CONTENT FULL:`);
    console.log(p.content.substring(0, 500) + (p.content.length > 500 ? '...' : ''));
    console.log(`\n📝 CONTENT LENGTH: ${p.contentLength}`);
  }

  // 3. Check for remaining truncation markers
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('TRUNCATION DETECTION');
  console.log(`${'='.repeat(80)}`);

  const problems: { postId: string | null; field: string; content: string }[] = [];

  for (const p of posts) {
    if (p.content && /See more|ดูเพิ่มเติม/i.test(p.content)) {
      problems.push({ postId: p.postId, field: 'content', content: p.content.substring(0, 200) });
    }
    if (p.contentFull && /See more|ดูเพิ่มเติม/i.test(p.contentFull)) {
      problems.push({ postId: p.postId, field: 'contentFull', content: p.contentFull.substring(0, 200) });
    }
  }

  if (problems.length === 0) {
    console.log('✅ No records contain "See more" or "ดูเพิ่มเติม" in content or contentFull');
  } else {
    console.log(`⚠️  Found ${problems.length} problem(s):`);
    for (const prob of problems) {
      console.log(`\n  Post ID: ${prob.postId}`);
      console.log(`  Field:   ${prob.field}`);
      console.log(`  Content: ${prob.content}`);
    }
  }

  // 4. Posts that still have preview == content (identical)
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('IDENTICAL PREVIEW/FULL ANALYSIS');
  console.log(`${'='.repeat(80)}`);

  let identicalCount = 0;
  for (const p of posts) {
    if (p.contentPreview && p.contentFull && p.contentPreview === p.contentFull) {
      identicalCount++;
      console.log(`  ⚠️  Post ${p.postId}: preview and full are IDENTICAL (${p.contentLength} chars)`);
    }
  }
  if (identicalCount === 0) {
    console.log('✅ All posts with preview/full have different content (expansion worked)');
  }

  // 5. Summary
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('FINAL CONCLUSION');
  console.log(`${'='.repeat(80)}`);

  const successfulExtractions = posts.filter(p => p.contentLength > 50).length;
  const failedExtractions = posts.filter(p => p.contentLength <= 50).length;

  console.log(`Total Posts Scraped:          ${totalPosts}`);
  console.log(`Average Content Length:       ${avgLength} chars`);
  console.log(`Longest Post:                 ${maxLength} chars`);
  console.log(`Shortest Post:                ${minLength} chars`);
  console.log(`Truncated Posts Count:        ${truncatedCount}`);
  console.log(`Successful Full Extractions:  ${successfulExtractions}`);
  console.log(`Failed/Suspicious Extractions: ${failedExtractions}`);

  if (truncatedCount === 0 && posts.some(p => p.contentLength > 500)) {
    console.log(`\n✅ YES - The scraper IS extracting full post content.`);
    console.log(`   ${successfulExtractions}/${totalPosts} posts have substantial content (>50 chars).`);
    console.log(`   Longest post: ${maxLength} chars (${Math.round(maxLength / 500)}x longer than preview threshold).`);
  } else if (truncatedCount > 0) {
    console.log(`\n❌ NO - ${truncatedCount} posts still contain truncation markers.`);
  } else {
    console.log(`\n❓ INCONCLUSIVE - Content was extracted but check the data.`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
