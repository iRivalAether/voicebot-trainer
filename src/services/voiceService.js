// Voice recognition service using Web Speech API
class VoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = this.checkSupport();
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    this.silenceTimer = null;
    this.silenceTimeout = 3000; // 3 seconds

    if (this.isSupported) {
      this.setupRecognition();
    }
  }

  checkSupport() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configuration
    this.recognition.continuous = true; // Changed to true to handle silence timeout
    this.recognition.interimResults = true; // Changed to true to detect silence
    this.recognition.lang = 'es-ES'; // Spanish by default, can be changed
    this.recognition.maxAlternatives = 1;

    // Event listeners
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('🎤 Voice recognition started');
      this.startSilenceTimer();
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      // Reset silence timer when speech is detected
      this.clearSilenceTimer();
      
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex][0];
      const transcript = result.transcript;
      const confidence = result.confidence;
      const isFinal = event.results[lastResultIndex].isFinal;
      
      console.log('🗣️ Speech recognized:', transcript, 'Confidence:', confidence);
      
      if (isFinal) {
        // Stop listening after final result
        this.stopListening();
        
        if (this.onResult) {
          this.onResult({
            transcript,
            confidence,
            isFinal
          });
        }
      } else {
        // Restart silence timer for interim results
        this.startSilenceTimer();
      }
    };

    this.recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      this.isListening = false;
      
      if (this.onError) {
        this.onError({
          error: event.error,
          message: this.getErrorMessage(event.error)
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.clearSilenceTimer();
      console.log('🛑 Voice recognition ended');
      if (this.onEnd) this.onEnd();
    };
  }

  startListening() {
    if (!this.isSupported) {
      throw new Error('Speech recognition not supported in this browser');
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      throw error;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.clearSilenceTimer();
      this.recognition.stop();
    }
  }

  startSilenceTimer() {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      console.log('⏰ Silence timeout reached (3 seconds)');
      this.stopListening();
    }, this.silenceTimeout);
  }

  clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  setLanguage(lang) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  getErrorMessage(error) {
    const errorMessages = {
      'no-speech': 'No se detectó voz. Intenta hablar más cerca del micrófono.',
      'audio-capture': 'No se pudo acceder al micrófono. Verifica los permisos.',
      'not-allowed': 'Permiso de micrófono denegado. Habilita el micrófono en la configuración.',
      'network': 'Error de red. Verifica tu conexión a internet.',
      'service-not-allowed': 'Servicio de reconocimiento de voz no permitido.',
      'aborted': 'Reconocimiento de voz cancelado.',
      'language-not-supported': 'Idioma no soportado.'
    };

    return errorMessages[error] || `Error desconocido: ${error}`;
  }

  // Event handler setters
  setOnResult(callback) {
    this.onResult = callback;
  }

  setOnError(callback) {
    this.onError = callback;
  }

  setOnStart(callback) {
    this.onStart = callback;
  }

  setOnEnd(callback) {
    this.onEnd = callback;
  }
}

export default VoiceService;