// MongoDB initialization script for AI Marketing Dashboard
db = db.getSiblingDB('ai_marketing');

db.createCollection('News');
db.createCollection('AIInsight');
db.createCollection('Campaign');

db.News.createIndex({ publishedAt: -1 });
db.News.createIndex({ category: 1 });
db.AIInsight.createIndex({ createdAt: -1 });
db.Campaign.createIndex({ status: 1 });
db.Campaign.createIndex({ createdAt: -1 });

print('MongoDB initialization complete.');
