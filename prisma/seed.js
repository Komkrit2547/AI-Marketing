const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '../thap_sakae_businesses_cleaned.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`Seed file not found: ${dataPath}`);
    return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const businesses = JSON.parse(rawData);

  console.log(`Starting to seed ${businesses.length} businesses...`);

  let count = 0;
  for (const b of businesses) {
    if (!b.placeId) continue;
    try {
      await prisma.business.upsert({
        where: { placeId: b.placeId },
        update: b,
        create: b,
      });
      count++;
    } catch (e) {
      console.error(`Error seeding business ${b.name}:`, e.message);
    }
  }

  console.log(`Successfully seeded ${count} businesses.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
