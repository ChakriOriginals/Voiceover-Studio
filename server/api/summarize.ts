import { Router, Request, Response } from 'express';
import { HfInference } from '@huggingface/inference';
import { config } from '../config/env.js';

const router = Router();

// Initialize Hugging Face client
const hf = new HfInference(config.huggingfaceToken);

interface SummarizeRequestBody {
  text: string;
}

// Type guard for Hugging Face errors
function isHuggingFaceError(error: unknown): error is Error {
  return error instanceof Error;
}

router.post('/', async (req: Request<{}, {}, SummarizeRequestBody>, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Text is required and must be a string'
      });
    }

    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      parameters: {
        max_length: 500,
        min_length: 30,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2
      }
    });

    return res.status(200).json({
      summary: result.summary_text
    });

  } catch (error) {
    console.error('Summarization error:', error);

    if (isHuggingFaceError(error)) {
      return res.status(400).json({
        error: 'Hugging Face API Error',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate summary'
    });
  }
});

export default router;