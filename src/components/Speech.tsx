import { useState, useRef } from 'react';
import { convertTextToSpeech } from '../api/waveApi';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Volume2 } from 'lucide-react';
import { ProcessedText } from '../utils/textUtils';

interface TextToSpeechProps {
  Text?: ProcessedText;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ Text }) => {
  const [voiceId, setVoiceId] = useState('arman');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleConvert = async () => {
    if (!Text?.summary?.trim()) {
      setError('No text available to convert. Please upload a PDF first.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const audioBlob = await convertTextToSpeech({
        text: Text.summary.trim(),
        voiceId
      });

      if (audioRef.current) {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };

        await audioRef.current.play();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select
                value={voiceId}
                onValueChange={setVoiceId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emily">Emily</SelectItem>
                  <SelectItem value="jasmine">Jasmine</SelectItem>
                  <SelectItem value="arman">Arman</SelectItem>
                  <SelectItem value="james">James</SelectItem>
                  <SelectItem value="mithali">Mithali</SelectItem>
                  <SelectItem value="aravind">Aravind</SelectItem>
                  <SelectItem value="raj">Raj</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={handleConvert}
                disabled={isLoading || !Text?.summary}
                className="w-full md:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <audio 
              ref={audioRef} 
              controls 
              className="w-full focus:outline-none"
            />
          </div>
          
          {!Text?.summary && (
            <div className="text-center text-gray-500 text-sm">
              Upload a PDF to generate audio
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextToSpeech;