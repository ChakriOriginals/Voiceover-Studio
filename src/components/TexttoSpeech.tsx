import React from 'react';
import { HfInference } from '@huggingface/inference';
import { Volume2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from '../hooks/use-toast';

interface AudioGeneratorProps {
  text: string;
  disabled?: boolean;
}

export const AudioGenerator: React.FC<AudioGeneratorProps> = ({ text, disabled }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);

  const generateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "No text provided for audio generation",
        variant: "destructive",
      });
      return;
    }

    if (!import.meta.env.VITE_HUGGINGFACE_TOKEN) {
      toast({
        title: "Configuration Error",
        description: "Hugging Face API token is not configured",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAudioUrl(null); // Clear previous audio

    try {
      console.log('Initializing Hugging Face inference...'); // Debug log
      const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_TOKEN);

      console.log('Starting text-to-speech conversion...'); // Debug log
      const response = await hf.textToSpeech({
        model: 'facebook/fastspeech2-en-ljspeech',
        inputs: text.slice(0, 1000).trim(), // Limit text length to avoid potential issues
      });

      console.log('Received response from API'); // Debug log

      if (!response) {
        throw new Error('No audio data received from the API');
      }

      // Create blob and URL
      const audioData = await response.arrayBuffer();
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      console.log('Audio URL created:', url); // Debug log
      setAudioUrl(url);
      
      toast({
        title: "Success",
        description: "Audio generated successfully",
      });
    } catch (err) {
      console.error('Detailed error:', err); // Detailed error logging
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate audio';
      toast({
        title: "Error",
        description: `Failed to generate audio: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup function
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Audio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Text length: {text.length} characters
        </div>

        <Button
          onClick={generateAudio}
          disabled={disabled || isLoading || !text.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Audio...
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Generate Audio
            </>
          )}
        </Button>

        {audioUrl && (
          <div className="mt-4">
            <audio
              controls
              className="w-full"
              src={audioUrl}
              onError={(e) => {
                console.error('Audio playback error:', e);
                toast({
                  title: "Playback Error",
                  description: "Failed to play the generated audio",
                  variant: "destructive",
                });
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {!import.meta.env.VITE_HUGGINGFACE_TOKEN && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-4 rounded-md mt-4">
            <p className="font-medium">Configuration Required</p>
            <p>Please add your Hugging Face API token to the .env file:</p>
            <code className="block bg-yellow-100 p-2 mt-2 rounded">
              VITE_HUGGINGFACE_TOKEN=your_token_here
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};