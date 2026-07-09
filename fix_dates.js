const { MongoClient } = require('mongodb');

// Try connecting to the local container
const url = 'mongodb://localhost:27017/ai_marketing?directConnection=true';
const client = new MongoClient(url);

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db('ai_marketing');
    
    const collection = db.collection('WeatherForecast');
    
    console.log("Finding documents...");
    const docs = await collection.find({ forecastDate: { $type: "string" } }).toArray();
    
    console.log(`Found ${docs.length} documents with string forecastDate.`);
    
    let count = 0;
    for (const doc of docs) {
      if (typeof doc.forecastDate === 'string') {
        const dateObj = new Date(doc.forecastDate);
        await collection.updateOne(
          { _id: doc._id },
          { $set: { forecastDate: dateObj } }
        );
        count++;
      }
    }
    
    console.log(`Updated ${count} documents.`);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
