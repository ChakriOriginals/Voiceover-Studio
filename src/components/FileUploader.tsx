import React, { useCallback, useState } from 'react';
import { Upload, Loader2, File } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      setFileName(file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === 'application/pdf') {
      setFileName(file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className="w-full max-w-2xl mx-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
          ) : fileName ? (
            <File className="w-10 h-10 text-blue-500 mb-3" />
          ) : (
            <Upload className="w-10 h-10 text-blue-500 mb-3" />
          )}
          
          <p className="mb-2 text-lg text-gray-700">
            {isLoading ? 'Processing...' : fileName ? fileName : 'Drop your PDF here'}
          </p>
          
          <p className="text-sm text-gray-500">
            {isLoading ? (
              'Please wait while we extract the text'
            ) : fileName ? (
              'Drop another file to replace'
            ) : (
              'or click to select a file'
            )}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isLoading}
        />
      </label>
    </div>
  );
}

export default FileUploader;