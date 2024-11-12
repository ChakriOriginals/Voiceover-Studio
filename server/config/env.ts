// env.ts
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the correct path
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Validate required environment variables
const requiredEnvVars = ['HUGGING_FACE_TOKEN'] as const;
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
}

export const config = {
  port: process.env.SERVER_PORT || 5000,
  huggingfaceToken: process.env.HUGGING_FACE_TOKEN,
  openaiKey: process.env.OPENAI_API_KEY,
  waveApiKey: process.env.WAVE_API_KEY || '',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate token format
if (config.huggingfaceToken && !config.huggingfaceToken.startsWith('hf_')) {
  console.error('Invalid Hugging Face token format. Token should start with "hf_"');
}

export default config;