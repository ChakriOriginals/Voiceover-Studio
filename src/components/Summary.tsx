import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface SummarizerProps {
  text: string;
  onSummaryComplete: (summary: string) => void;
}

const summarizeText = async (text: string): Promise<string> => {
  const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_length: 250,
        min_length: 100,
        do_sample: false
      }
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to summarize text');
  }

  const data = await response.json();
  return data[0].summary_text;
};

const TextSummarizer: React.FC<SummarizerProps> = ({ text, onSummaryComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const summary = await summarizeText(text);
      onSummaryComplete(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg mb-6">
      <CardHeader>
        <CardTitle>Text Summarization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-600">{text}</p>
          </div>
          
          <Button
            onClick={handleSummarize}
            disabled={isLoading || !text}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextSummarizer;