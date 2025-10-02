<template>
  <div class="chat-interface">
    <!-- Voice Selector -->
    <div class="voice-selector-container">
      <label for="voice-select" class="voice-label">🎤 Narrador:</label>
      <select 
        id="voice-select" 
        v-model="selectedVoiceIndex" 
        @change="changeVoice"
        class="voice-select"
      >
        <option 
          v-for="(voice, index) in availableVoices" 
          :key="index" 
          :value="index"
        >
          {{ voice.name }} ({{ voice.lang }})
        </option>
      </select>
    </div>

    <!-- Conversation History -->
    <div class="conversation-container">
      <div class="conversation-scroll" ref="conversationRef">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="welcome-content">
            <h3>🎤 ¡Bienvenido a tu Entrenador Virtual!</h3>
            <p>Puedes hablar o escribir para pedir:</p>
            <ul class="feature-list">
              <li>🏋️ <strong>Ejercicios:</strong> "ejercicios para brazos", "rutina de piernas"</li>
              <li>🥗 <strong>Nutrición:</strong> "qué comer en el desayuno", "dieta ligera"</li>
              <li>💪 <strong>Motivación:</strong> "dame motivación", "necesito ánimos"</li>
            </ul>
          </div>
        </div>

        <TransitionGroup name="message" tag="div">
          <div 
            v-for="message in messages" 
            :key="message.id"
            :class="['message', message.type]"
          >
            <div class="message-content">
              <div class="message-avatar">
                {{ message.type === 'user' ? '🧑' : '🏋️‍♂️' }}
              </div>
              <div class="message-text">
                <div v-if="message.type === 'bot' && message.isHtml" v-html="message.text"></div>
                <div v-else>{{ message.text }}</div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
              <button 
                v-if="message.type === 'bot'" 
                @click="speakMessage(message.text)"
                class="replay-button"
                :disabled="isSpeaking"
              >
                {{ isSpeaking ? '🔊' : '🔇' }}
              </button>
            </div>
          </div>
        </TransitionGroup>

        <!-- Processing indicator -->
        <div v-if="isProcessing" class="message bot processing">
          <div class="message-content">
            <div class="message-avatar">🏋️‍♂️</div>
            <div class="message-text">
              <div class="loading-dots">
                <span>Procesando</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-container">
      <div class="input-wrapper">
        <!-- Voice Button -->
        <button 
          @click="toggleVoice"
          :class="['voice-button', { 'listening': isListening, 'disabled': isProcessing }]"
          :disabled="isProcessing"
          :title="isListening ? 'Detener grabación' : 'Hablar'"
        >
          <span class="voice-icon">{{ isListening ? '🛑' : '🎤' }}</span>
          <span class="voice-text">
            {{ isListening ? 'Escuchando...' : 'Hablar' }}
          </span>
        </button>

        <!-- Text Input -->
        <div class="text-input-container">
          <input 
            v-model="textInput"
            @keypress.enter="sendTextMessage"
            :disabled="isProcessing || isListening"
            placeholder="Escribe tu mensaje o usa el botón de voz..."
            class="text-input"
          />
          <button 
            @click="sendTextMessage"
            :disabled="!textInput.trim() || isProcessing || isListening"
            class="send-button"
          >
            📤
          </button>
        </div>
      </div>

      <!-- Status indicator -->
      <div v-if="isListening" class="status-indicator listening">
        <div class="pulse-dot"></div>
        <span>Habla ahora... (Escuchando)</span>
      </div>
      <div v-else-if="isProcessing" class="status-indicator processing">
        <div class="loading"></div>
        <span>Procesando tu solicitud...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import SpeechService from '../services/speechService.js'

export default {
  name: 'ChatInterface',
  props: {
    isListening: {
      type: Boolean,
      default: false
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['user-message', 'voice-toggle'],
  setup(props, { emit }) {
    const messages = ref([])
    const textInput = ref('')
    const conversationRef = ref(null)
    const speechService = ref(null)
    const isSpeaking = ref(false)
    const availableVoices = ref([])
    const selectedVoiceIndex = ref(0)
    let messageCounter = 0

    const addMessage = (text, type = 'user', isHtml = false) => {
      const message = {
        id: ++messageCounter,
        text,
        type,
        isHtml,
        timestamp: new Date()
      }
      messages.value.push(message)
      
      nextTick(() => {
        scrollToBottom()
      })
      
      return message
    }

    const scrollToBottom = () => {
      if (conversationRef.value) {
        conversationRef.value.scrollTop = conversationRef.value.scrollHeight
      }
    }

    const sendTextMessage = () => {
      if (!textInput.value.trim() || props.isProcessing) return
      
      const message = textInput.value.trim()
      addMessage(message, 'user')
      emit('user-message', message)
      textInput.value = ''
    }

    const toggleVoice = () => {
      emit('voice-toggle')
    }

    const speakMessage = async (text) => {
      if (isSpeaking.value) {
        speechService.value?.stop()
        isSpeaking.value = false
        return
      }

      try {
        isSpeaking.value = true
        // Remove HTML tags for speech
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/\*\*/g, '')
        await speechService.value?.speak(cleanText)
      } catch (error) {
        console.error('Speech error:', error)
      } finally {
        isSpeaking.value = false
      }
    }

    const formatTime = (date) => {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    // Listen for bot responses
    const handleBotResponse = (event) => {
      const { response, isHtml } = event.detail
      addMessage(response, 'bot', isHtml)
    }

    const loadVoices = () => {
      if (speechService.value) {
        availableVoices.value = speechService.value.voices.filter(voice => 
          voice.lang.includes('es') || voice.lang.includes('en')
        )
        
        // Set default to Spanish voice if available
        const spanishVoiceIndex = availableVoices.value.findIndex(voice => 
          voice.lang.includes('es')
        )
        selectedVoiceIndex.value = spanishVoiceIndex >= 0 ? spanishVoiceIndex : 0
      }
    }

    const changeVoice = () => {
      if (speechService.value && availableVoices.value[selectedVoiceIndex.value]) {
        speechService.value.currentVoice = availableVoices.value[selectedVoiceIndex.value]
        console.log('🎯 Voice changed to:', speechService.value.currentVoice.name)
      }
    }

    onMounted(() => {
      speechService.value = new SpeechService()
      
      // Wait for voices to load
      setTimeout(() => {
        loadVoices()
      }, 100)
      
      // Listen for voices changed
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          loadVoices()
        }
      }
      
      // Listen for custom events from parent
      window.addEventListener('bot-response', handleBotResponse)
    })

    onUnmounted(() => {
      window.removeEventListener('bot-response', handleBotResponse)
      if (speechService.value) {
        speechService.value.stop()
      }
    })

    // Expose method to add bot messages
    const addBotMessage = (text, isHtml = false) => {
      return addMessage(text, 'bot', isHtml)
    }

    return {
      messages,
      textInput,
      conversationRef,
      isSpeaking,
      availableVoices,
      selectedVoiceIndex,
      addMessage,
      addBotMessage,
      sendTextMessage,
      toggleVoice,
      speakMessage,
      changeVoice,
      formatTime
    }
  }
}
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 70vh;
  max-height: 600px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.voice-selector-container {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.voice-label {
  font-weight: 500;
  color: #495057;
  margin: 0;
}

.voice-select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: white;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.voice-select:hover {
  border-color: #007bff;
}

.voice-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.conversation-container {
  flex: 1;
  overflow: hidden;
}

.conversation-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  scroll-behavior: smooth;
}

.welcome-message {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.welcome-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.feature-list li {
  margin: 0.8rem 0;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}

.message {
  margin-bottom: 1.5rem;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 1.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.message-text {
  flex: 1;
  padding: 1rem 1.2rem;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  margin-left: 2rem;
}

.message.bot .message-text {
  background: #f8f9fa;
  color: #333;
  margin-right: 2rem;
  border: 1px solid #e9ecef;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.6;
  margin-top: 0.5rem;
}

.replay-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.replay-button:hover {
  background: #f0f0f0;
}

.replay-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.processing .message-text {
  background: #e3f2fd;
  border-color: #90caf9;
}

.loading-dots {
  display: flex;
  align-items: center;
  gap: 2px;
}

.dot {
  animation: loadingDots 1.4s ease-in-out infinite both;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes loadingDots {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

.input-container {
  border-top: 1px solid #e9ecef;
  padding: 1.5rem;
  background: #f8f9fa;
}

.input-wrapper {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

.voice-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  padding: 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.voice-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

.voice-button.listening {
  background: linear-gradient(135deg, #ff4757, #c44569);
  animation: pulse 2s infinite;
}

.voice-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.voice-icon {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
}

.voice-text {
  font-size: 0.8rem;
}

.text-input-container {
  flex: 1;
  display: flex;
  gap: 0.5rem;
}

.text-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.text-input:focus {
  border-color: #667eea;
}

.text-input:disabled {
  background: #f8f9fa;
  opacity: 0.6;
}

.send-button {
  padding: 1rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.send-button:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-indicator.listening {
  background: #e8f5e8;
  color: #2d5a2d;
}

.status-indicator.processing {
  background: #fff3cd;
  color: #856404;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Transition animations */
.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-active {
  transition: all 0.3s ease-in;
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .input-wrapper {
    flex-direction: column;
  }
  
  .voice-button {
    min-width: auto;
    flex-direction: row;
    justify-content: center;
  }
  
  .voice-icon {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
  
  .conversation-scroll {
    padding: 1rem;
  }
  
  .message-text {
    padding: 0.8rem 1rem;
  }
  
  .message.user .message-text {
    margin-left: 1rem;
  }
  
  .message.bot .message-text {
    margin-right: 1rem;
  }
}
</style>