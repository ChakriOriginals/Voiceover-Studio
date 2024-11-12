import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { setupTextToSpeech } from './texttospeech.ts';
//import Sidebar  from "d:/voiceover-studio/frontend/components/sidebar.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
setupTextToSpeech();
