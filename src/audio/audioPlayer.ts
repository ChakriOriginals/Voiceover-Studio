export class AudioPlayer {
    private audioElement: HTMLAudioElement | null = null;
    private audioContainer: HTMLElement | null;
  
    constructor(containerId: string) {
      this.audioContainer = document.getElementById(containerId);
      if (!this.audioContainer) {
        throw new Error(`Container with id ${containerId} not found`);
      }
    }
  
    public async play(audioBlob: Blob): Promise<void> {
      if (!this.audioContainer) return;
  
      try {
        // Clean up previous audio if it exists
        this.clear();
  
        // Create new audio element
        this.audioElement = document.createElement('audio');
        this.audioElement.controls = true;
        
        // Create and set blob URL
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audioElement.src = audioUrl;
        
        // Add to container
        this.audioContainer.appendChild(this.audioElement);
        
        // Wait for audio to be loaded before playing
        await new Promise((resolve) => {
          if (this.audioElement) {
            this.audioElement.onloadeddata = resolve;
          }
        });
  
        // Play audio
        if (this.audioElement) {
          await this.audioElement.play();
        }
        
        // Clean up blob URL when audio is done
        if (this.audioElement) {
          this.audioElement.onended = () => {
            if (audioUrl) {
              URL.revokeObjectURL(audioUrl);
            }
          };
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        throw new Error('Failed to play audio');
      }
    }
  
    public clear(): void {
      if (this.audioElement && this.audioContainer) {
        URL.revokeObjectURL(this.audioElement.src);
        this.audioContainer.removeChild(this.audioElement);
        this.audioElement = null;
      }
    }
  }