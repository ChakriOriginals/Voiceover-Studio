import React from 'react';
import { useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  downloadUrl: string;
  title?: string;
}

const AudioPlayer = ({ audioUrl, downloadUrl, title = 'Speech from Lightning Model' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl text-white mb-4">{title}</h2>
      
      <div className="flex flex-col space-y-4">
        {/* Audio Player */}
        <audio 
          className="w-full" 
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>

        {/* Download Button */}
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Audio
        </a>
      </div>
    </div>
  );
};

export default AudioPlayer;