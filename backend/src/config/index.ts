export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/ai_marketing',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
} as const;
