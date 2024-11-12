import express from 'express';
import OpenAI from 'openai';
import { config } from '../config/env.js';

const router = express.Router();
const openai = new OpenAI({
  apiKey: config.openaiKey
});

router.post('/generate', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const mp3Response = await openai.audio.speech.create({
      model: "tts-1", 
      voice: "alloy", 
      input: text,
    });

    // Convert the raw response to buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    // Set appropriate headers for audio download
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="generated-speech.mp3"');
    
    // Send the audio buffer
    res.send(buffer);

  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ 
      error: 'Failed to generate audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;