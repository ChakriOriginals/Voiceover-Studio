import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';
import { ProcessedText, cleanText, calculateReadingTime } from '../utils/textUtils';
import { toast } from 'd:/voiceover/voice-studio/src/hooks/use-toast';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api/summarize';

interface TextProcessorProps {
  text: string;
  onProcessed: (result: ProcessedText) => void;
}

export const TextProcessor: React.FC<TextProcessorProps> = ({ text, onProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processText = async () => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Clean the text
      const cleanedText = await cleanText(text);

      console.log('Sending request to:', API_URL); // Debug log

      // Generate summary using the API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: cleanedText }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate summary' }));
        throw new Error(errorData.message || 'Failed to generate summary');
      }

      const data = await response.json();

      // Calculate additional metrics
      const wordCount = cleanedText.split(/\s+/).length;
      const readingTime = calculateReadingTime(cleanedText);

      onProcessed({
        cleaned: cleanedText,
        summary: data.summary,
        wordCount,
        readingTime,
        cleanText: ''
      });

      toast({
        title: "Success",
        description: "Text processed successfully",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Text processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      processText();
    }, 500); // Add a small delay to avoid processing while user is still typing

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <Card className="w-9/12">
        <div className="space-y-4">
          {isProcessing && (
            <div className="flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="ml-2">Processing...</span>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}
        </div>
    </Card>
  );
};

export default TextProcessor;