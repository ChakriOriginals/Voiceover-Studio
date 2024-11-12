import axios from 'axios';

const API_URL = 'https://waves-api.smallest.ai/api/v1/lightning/get_speech';
const SAMPLE_RATE = 16000;

export interface TextToSpeechRequest {
  text: string;
  voiceId: string;
}

function createWavHeader(pcmData: ArrayBuffer): ArrayBuffer {
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  // RIFF identifier 'RIFF'
  view.setUint32(0, 0x52494646, false);
  // File length minus RIFF header
  view.setUint32(4, 36 + pcmData.byteLength, true);
  // RIFF type 'WAVE'
  view.setUint32(8, 0x57415645, false);
  // Format chunk identifier 'fmt '
  view.setUint32(12, 0x666D7420, false);
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (raw)
  view.setUint16(20, 1, true);
  // Channel count
  view.setUint16(22, 1, true);
  // Sample rate
  view.setUint32(24, SAMPLE_RATE, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, SAMPLE_RATE * 2, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // Data chunk identifier 'data'
  view.setUint32(36, 0x64617461, false);
  // Data chunk length
  view.setUint32(40, pcmData.byteLength, true);
  
  return wavHeader;
}

export async function convertTextToSpeech({ text, voiceId }: TextToSpeechRequest): Promise<Blob> {
  try {
    const response = await axios({
      method: 'post',
      url: API_URL,
      data: {
        voice_id: voiceId,
        text: text,
        sample_rate: SAMPLE_RATE
      },
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_WAVES_API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
      throw new Error('Failed to convert text to speech');
    }

    // Create WAV header
    const wavHeader = createWavHeader(response.data);
    
    // Combine header with PCM data
    const wavBlob = new Blob([wavHeader, response.data], { 
      type: 'audio/wav' 
    });

    return wavBlob;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to convert text to speech. Please try again.');
  }
}