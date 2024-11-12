export interface AudioConversionResult {
    url: string;
    blob: Blob;
  }
  
  export class AudioConversionError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AudioConversionError';
    }
  }
  
  export async function handleAudioResponse(response: Response): Promise<Blob> {
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new AudioConversionError(
        `Server error (${response.status}): ${errorText}`
      );
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('audio/')) {
      console.warn('Unexpected content type:', contentType);
    }
    
    try {
      const arrayBuffer = await response.arrayBuffer();
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new AudioConversionError('Received empty audio data from server');
      }
  
      // Create blob with explicit audio MIME type
      const blob = new Blob([arrayBuffer], { 
        type: contentType || 'audio/mpeg' // Changed from wav to mpeg as it's more widely supported
      });
  
      // Verify blob was created successfully
      if (!blob || blob.size === 0) {
        throw new AudioConversionError('Failed to create audio blob');
      }
  
      return blob;
    } catch (error) {
      console.error('Error processing audio response:', error);
      if (error instanceof AudioConversionError) {
        throw error;
      }
      throw new AudioConversionError(
        'Failed to process audio response: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
  
  export function createAudioUrl(blob: Blob): string {
    if (!blob || blob.size === 0) {
      throw new AudioConversionError('Cannot create URL from empty blob');
    }
    try {
      const url = URL.createObjectURL(blob);
      if (!url) {
        throw new AudioConversionError('Failed to create audio URL');
      }
      return url;
    } catch (error) {
      console.error('Error creating audio URL:', error);
      throw new AudioConversionError('Failed to create audio URL');
    }
  }
  
  export function cleanupAudioUrl(url: string | null): void {
    if (url) {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Error cleaning up audio URL:', error);
      }
    }
  }