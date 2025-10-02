// Text-to-Speech service using Web Speech API
class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    this.voices = [];
    this.currentVoice = null;
    this.isSpeaking = false;

    if (this.isSupported) {
      this.loadVoices();
      // Voices might load asynchronously
      this.synthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    
    // Try to find a Spanish voice
    this.currentVoice = this.voices.find(voice => 
      voice.lang.includes('es') && voice.localService
    ) || this.voices.find(voice => 
      voice.lang.includes('es')
    ) || this.voices[0];

    console.log('🗣️ Available voices:', this.voices.length);
    console.log('🎯 Selected voice:', this.currentVoice?.name);
  }

  speak(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configuration
      utterance.voice = options.voice || this.currentVoice;
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || 'es-ES';

      // Event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('🔊 Started speaking:', text.substring(0, 50) + '...');
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        console.log('🔇 Finished speaking');
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('❌ Speech error:', event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      utterance.onpause = () => {
        console.log('⏸️ Speech paused');
      };

      utterance.onresume = () => {
        console.log('▶️ Speech resumed');
      };

      // Start speaking
      this.synthesis.speak(utterance);
    });
  }

  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  pause() {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  setVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.currentVoice = voice;
      console.log('🎤 Voice changed to:', voiceName);
    }
  }

  getAvailableVoices() {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      localService: voice.localService,
      isDefault: voice.default
    }));
  }

  getSpanishVoices() {
    return this.voices
      .filter(voice => voice.lang.includes('es'))
      .map(voice => ({
        name: voice.name,
        lang: voice.lang,
        localService: voice.localService
      }));
  }

  // Utility method to speak with different emotions/styles
  speakWithEmotion(text, emotion = 'neutral') {
    const emotionSettings = {
      excited: { rate: 1.1, pitch: 1.2, volume: 1 },
      calm: { rate: 0.8, pitch: 0.9, volume: 0.8 },
      encouraging: { rate: 1.0, pitch: 1.1, volume: 1 },
      neutral: { rate: 0.9, pitch: 1.0, volume: 1 }
    };

    const settings = emotionSettings[emotion] || emotionSettings.neutral;
    return this.speak(text, settings);
  }

  // Method to add SSML-like pauses and emphasis
  formatResponse(text) {
    // Add natural pauses after sentences and emphasis
    return text
      .replace(/\./g, '. ')
      .replace(/!/g, '! ')
      .replace(/\?/g, '? ')
      .replace(/,/g, ', ');
  }
}

export default SpeechService;