import { AudioPlayer } from './audio/audioPlayer';
import { UIController } from './components/uicontroller';
import { convertTextToSpeech } from './api/waveApi';

export function setupTextToSpeech(): void {
  const ui = new UIController();
  const audioPlayer = new AudioPlayer('audioContainer');

  async function handleConversion() {
    const text = ui.getText();
    
    if (!text) {
      ui.showError('Please enter some text to convert');
      return;
    }

    try {
      ui.setLoading(true);
      ui.hideError();

      const audioBlob = await convertTextToSpeech({
        text,
        voiceId: ui.getVoiceId()
      });

      audioPlayer.play(audioBlob);
    } catch (error) {
      ui.showError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      ui.setLoading(false);
    }
  }

  document.getElementById('convertBtn')?.addEventListener('click', handleConversion);
}