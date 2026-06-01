n8n workflow files for AI Contextual Marketing Dashboard.

## Workflows

### 1. News & Weather to Insights
- Triggers on a schedule (cron)
- Fetches local news from NewsAPI
- Fetches weather data
- Combines data and sends to OpenAI
- Generates marketing insights
- Saves results to MongoDB

## Setup
1. Import workflow JSON files into n8n
2. Configure API keys (NewsAPI, OpenWeatherMap, OpenAI)
3. Set the MongoDB connection string
4. Activate the workflow
