import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import summarizeRouter from './api/summarize.js';
//import audioGeneratorRouter from './api/audioGenerator.js';
import generateAudio from './api/generateAudio';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Rejected request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Increase payload limit if needed
app.use(express.json({ limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    allowedOrigins: config.allowedOrigins 
  });
});

// Routes
app.use('/api/summarize', summarizeRouter);
//app.use('/api/audio', audioGeneratorRouter);
// Serve audio files from the audio_output directory
app.use('/audio', express.static(path.join(__dirname, '../audio_output')));

// Register the TTS API route
app.use('/api', generateAudio);

// Error handling
app.use(errorHandler);

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed origins: ${config.allowedOrigins.join(', ')}`);
});

export default app;