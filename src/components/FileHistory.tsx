import { File, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ProcessedText } from '../utils/textUtils';

export interface FileHistoryEntry {
  id: string;
  fileName: string;
  uploadDate: Date;
  fileSize: number;
  extractedText: string;
  processedText?: ProcessedText;
}

interface FileHistoryProps {
  history: FileHistoryEntry[];
  onFileSelect: (entry: FileHistoryEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function FileHistory({ history, onFileSelect, onDeleteEntry }: FileHistoryProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
        >
          <Button
            variant="ghost"
            className="flex items-center gap-3 flex-1 h-auto p-2 justify-start"
            onClick={() => onFileSelect(entry)}
          >
            <File className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900 truncate">{entry.fileName}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(entry.fileSize)} • {formatDate(entry.uploadDate)}
              </p>
            </div>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => onDeleteEntry(entry.id)}
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      ))}
    </div>
  );
}