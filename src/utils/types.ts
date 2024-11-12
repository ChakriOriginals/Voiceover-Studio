// types/index.ts or utils/types.ts
export interface ProcessedText {
    originalText: string;
    summary?: string;
    title?: string;
    author?: string;
    numberOfPages?: number;
  }
  
  export interface TextToSpeechProps {
    Text?: ProcessedText | null;
  }
  
  export interface SummarizerProps {
    text: string;
    onSummaryComplete: (summary: string) => void;
  }