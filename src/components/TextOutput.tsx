import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ProcessedText } from '../utils/textUtils';

interface TextOutputProps {
  text: string;
  processedText?: ProcessedText;
}


export const TextOutput: React.FC<TextOutputProps> = ({ text, processedText }) => {

  return (
    <div className="w-full space-y-4">
      {processedText && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{processedText.summary}</p>
              <div className="mt-4 flex gap-4 text-sm text-gray-500">
                <span>{processedText.wordCount} words</span>
                <span>~{processedText.readingTime} min read</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cleaned Text</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{processedText.cleaned}</p>
            </CardContent>
          </Card>
        </>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Original Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{text}</p>
        </CardContent>
      </Card>
    </div>
  );
};
