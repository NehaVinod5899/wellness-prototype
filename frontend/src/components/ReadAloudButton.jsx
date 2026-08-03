import { useEffect, useState } from 'react';
import { isReadAloudEnabled, isSpeechSupported, speak, stopSpeaking } from '../tts.jsx';

export default function ReadAloudButton({ text }) {
  const [enabled] = useState(isReadAloudEnabled);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  if (!enabled || !isSpeechSupported() || !text) return null;

  function handleClick() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const started = speak(text);
    setSpeaking(started);
    if (started) {
      const check = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setSpeaking(false);
          clearInterval(check);
        }
      }, 300);
    }
  }

  return (
    <button type="button" className="read-aloud-btn tap-target" onClick={handleClick}>
      {speaking ? '⏹ Stop' : '🔊 Read aloud'}
    </button>
  );
}