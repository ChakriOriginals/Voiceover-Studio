import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileUploader } from './components/FileUploader';
import { ErrorMessage } from './components/ErrorMessage';
import { extractTextFromPDF } from './utils/pdfUtils';
import { Toaster } from "./components/ui/toaster";
import TextToSpeech from './components/Speech';
import { ProcessedText } from './utils/textUtils';
import { FileHistory, FileHistoryEntry } from './components/FileHistory';
import { Button } from './components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { useToast } from "./hooks/use-toast";
import { TextProcessor } from './components/TextProcessor';
//import { TextOutput } from './components/TextOutput';
//import { TextOutput } from './components/TextOutput';
//import { TextProcessor } from './components/TextProcessor';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [processedText, setProcessedText] = useState<ProcessedText | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileHistory, setFileHistory] = useState<FileHistoryEntry[]>([]);
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('voiceoverHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setFileHistory(parsed.map((item: any) => ({
          ...item,
          uploadDate: new Date(item.uploadDate)
        })));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('voiceoverHistory', JSON.stringify(fileHistory));
  }, [fileHistory]);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setExtractedText('');
    setProcessedText(undefined);
    
    try {
      setIsLoading(true);
      const text = await extractTextFromPDF(file);
      setExtractedText(text);

      // Add to history
      const newEntry: FileHistoryEntry = {
        id: uuidv4(),
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date(),
        extractedText: text,
        processedText: undefined,
      };

      setFileHistory(prev => {
        const newHistory = [newEntry, ...prev].slice(0, 10); // Keep last 10 items
        return newHistory;
      });

      toast({
        title: "Success",
        description: "File processed successfully",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error processing PDF:', error);

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (entry: FileHistoryEntry) => {
    setExtractedText(entry.extractedText);
    if (entry.processedText) {
      setProcessedText(entry.processedText);
    }
    toast({
      description: `Loaded: ${entry.fileName}`,
    });
  };

  const handleDeleteEntry = (id: string) => {
    setFileHistory(prev => prev.filter(entry => entry.id !== id));
    toast({
      description: "History entry removed",
    });
  };

  const handleClearHistory = () => {
    setFileHistory([]);
    localStorage.removeItem('voiceoverHistory');
    toast({
      description: "History cleared",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="h-full p-4 space-y-8">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold tracking-tight">Voiceover Studio</h2>
            </div>
            <p className="text-sm text-muted-foreground">Generate voiceovers for your documents</p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-4xl mx-auto">
          {/* File Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-8">
            {error && (
              <ErrorMessage
                message={error}
                onDismiss={() => setError(null)} />
            )}

            <FileUploader
              onFileSelect={handleFileSelect}
              isLoading={isLoading} />

            {extractedText && (
              <TextProcessor
                text={extractedText}
                onProcessed={setProcessedText}
              />
            )}

            {/* Text Output and Audio Generator Section */}
            <div className="w-full space-y-8">
              {/*{(extractedText || isLoading || processedText) && (
                <TextOutput
                  text={isLoading ? 'Processing your PDF...' : extractedText}
                  processedText={processedText}
                />
              )}*/}

            {/* Text Output and Audio Generator Section */}
            <div className="w-full space-y-8">
              
              <TextToSpeech Text={processedText} />
            </div>
          </div>
          </div>

          {/* History Section */}
          <div className="mt-16 px-4 lg:px-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <h3 className="text-lg font-medium">History</h3>
                </div>
                {fileHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearHistory}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </Button>
                )}
              </div>
              
              {fileHistory.length === 0 ? (
                <div className="border rounded-lg p-8 bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">No history found</p>
                    <p className="text-xs text-gray-400 mt-1">You have no uploads so far</p>
                  </div>
                </div>
              ) : (
                <FileHistory
                  history={fileHistory}
                  onFileSelect={handleHistorySelect}
                  onDeleteEntry={handleDeleteEntry}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;