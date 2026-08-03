export function isReadAloudEnabled() {
  return localStorage.getItem('wellness.readAloud') === 'on';
}
export function speak(text) {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  return true;
}
export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
export function isSpeechSupported() {
  return 'speechSynthesis' in window;
}