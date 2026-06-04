// Migration & Maintenance script: Fix AIInsight createdAt field
// 1. Converts string dates to proper ISODate objects (fixes old bad data)
// 2. Adds createdAt to documents that don't have it (from n8n inserts)
// This is idempotent and safe to run multiple times

db = db.getSiblingDB('ai_marketing');

const collection = db.AIInsight;

let fixedCount = 0;

// Step 1: Fix documents where createdAt is stored as a string instead of Date
const stringDates = collection.find({
  createdAt: { $type: "string" }
});

stringDates.forEach(function(doc) {
  try {
    const dateValue = new Date(doc.createdAt);
    
    if (!isNaN(dateValue.getTime())) {
      collection.updateOne(
        { _id: doc._id },
        { $set: { createdAt: dateValue } }
      );
      fixedCount++;
    } else {
      // If the string can't be parsed, use the ObjectId timestamp
      const fallbackDate = doc._id.getTimestamp ? doc._id.getTimestamp() : new Date();
      collection.updateOne(
        { _id: doc._id },
        { $set: { createdAt: fallbackDate } }
      );
      fixedCount++;
      print('WARNING: Could not parse date "' + doc.createdAt + '" for doc ' + doc._id + ', used ObjectId timestamp');
    }
  } catch (e) {
    print('ERROR fixing doc ' + doc._id + ': ' + e.message);
  }
});

// Step 2: Add createdAt to documents that don't have it at all
// (This happens when n8n inserts without createdAt field)
const result = collection.updateMany(
  { createdAt: { $exists: false } },
  [{ $set: { createdAt: "$$NOW" } }]
);

if (result.modifiedCount > 0) {
  fixedCount += result.modifiedCount;
  print('Added createdAt to ' + result.modifiedCount + ' documents that were missing it.');
}

if (fixedCount > 0) {
  print('Total fixed: ' + fixedCount + ' AIInsight documents.');
} else {
  print('All AIInsight documents OK. No fix needed.');
}

// ----------------------------------------------------
// Campaign Collection Fixes
// ----------------------------------------------------
const campaignCollection = db.Campaign;
let campaignFixedCount = 0;

// Add createdAt to campaigns missing it
const campaignCreatedAtResult = campaignCollection.updateMany(
  { createdAt: { $exists: false } },
  [{ $set: { createdAt: "$$NOW" } }]
);

if (campaignCreatedAtResult.modifiedCount > 0) {
  campaignFixedCount += campaignCreatedAtResult.modifiedCount;
  print('Added createdAt to ' + campaignCreatedAtResult.modifiedCount + ' Campaign documents.');
}

// Add updatedAt to campaigns missing it
const campaignUpdatedAtResult = campaignCollection.updateMany(
  { updatedAt: { $exists: false } },
  [{ $set: { updatedAt: "$$NOW" } }]
);

if (campaignUpdatedAtResult.modifiedCount > 0) {
  campaignFixedCount += campaignUpdatedAtResult.modifiedCount;
  print('Added updatedAt to ' + campaignUpdatedAtResult.modifiedCount + ' Campaign documents.');
}

if (campaignFixedCount > 0) {
  print('Total fixed: ' + campaignFixedCount + ' Campaign documents.');
} else {
  print('All Campaign documents OK. No fix needed.');
}
