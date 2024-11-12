export interface TextToSpeechResponse {
    audio_base64: string;
    message: string;
    status: string;
  }
  
  export interface TextToSpeechRequest {
    voice_id: string;
    text: string;
    sample_rate: number;
  }