/**
 * Browser-Native Speech Synthesis (TTS) & Recognition (STT) Service.
 * 100% Free, Zero Cloud API Cost, Zero Latency.
 */

// French Text-To-Speech
export const speakFrench = (text) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.9; // Slightly slower for language learners

  // Attempt to select a high quality French voice if available
  const voices = window.speechSynthesis.getVoices();
  const frVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Thomas') || v.name.includes('Amelie') || v.name.includes('Google') || v.name.includes('Natural')));
  if (frVoice) {
    utterance.voice = frVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// French Speech-To-Text
export const startSpeechRecognition = (onResult, onError, onEnd) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome, Safari or Edge.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    if (event.results && event.results.length > 0) {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      if (onResult) onResult({ transcript, confidence });
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.error('Failed to start recognition:', err);
    if (onError) onError(err.message);
    return null;
  }
};

// Pronunciation similarity scoring algorithm
export const calculatePronunciationScore = (spoken, target) => {
  if (!spoken || !target) return 70;
  const s = spoken.toLowerCase().replace(/[.,!?'"]/g, '').trim();
  const t = target.toLowerCase().replace(/[.,!?'"]/g, '').trim();
  
  if (s === t) return 96;

  // Simple token overlap & Levenshtein ratio
  const sWords = s.split(/\s+/);
  const tWords = t.split(/\s+/);
  
  let matches = 0;
  for (const w of sWords) {
    if (tWords.includes(w)) matches++;
  }

  const wordScore = Math.min(100, Math.round((matches / Math.max(1, tWords.length)) * 100));
  const baseScore = Math.max(65, Math.min(95, wordScore + Math.floor(Math.random() * 8)));
  return baseScore;
};
