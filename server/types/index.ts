export interface SummarizeRequest {
    text: string;
  }
  
  export interface SummarizeResponse {
    summary: string;
    error?: string;
  }