<template>
  <div class="voicebot-app">
    <!-- Header -->
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">
          🏋️‍♂️ Entrenador Personal Virtual
        </h1>
        <p class="app-subtitle">
          Tu coach personal con inteligencia artificial y control por voz
        </p>
      </div>
    </header>

    <!-- Main Chat Interface -->
    <main class="chat-container">
      <div class="container">
        <ChatInterface 
          ref="chatInterface"
          @user-message="handleUserMessage"
          @voice-toggle="handleVoiceToggle"
          :is-listening="isListening"
          :is-processing="isProcessing"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container">
        <p>💡 Puedes hablar o escribir: "ejercicios para brazos", "dieta para cena", "dame motivación"</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import ChatInterface from './components/ChatInterface.vue'
import VoiceService from './services/voiceService.js'
import SpeechService from './services/speechService.js'
import AIService from './services/aiService.js'
import ExerciseService from './services/exerciseService.js'
import NutritionService from './services/nutritionService.js'
import LoggingService from './services/loggingService.js'

export default {
  name: 'App',
  components: {
    ChatInterface
  },
  setup() {
    const isListening = ref(false)
    const isProcessing = ref(false)
    const voiceService = ref(null)
    const speechService = ref(null)
    const chatInterface = ref(null)

    const initializeServices = () => {
      // Initialize voice service
      voiceService.value = new VoiceService()
      speechService.value = new SpeechService()

      // Set up voice service callbacks
      voiceService.value.setOnStart(() => {
        isListening.value = true
      })

      voiceService.value.setOnEnd(() => {
        isListening.value = false
      })

      voiceService.value.setOnResult(async (result) => {
        if (result.transcript && result.transcript.trim()) {
          await handleUserMessage(result.transcript.trim())
        }
      })

      voiceService.value.setOnError((error) => {
        isListening.value = false
        console.error('Voice recognition error:', error)
      })
    }

    const handleUserMessage = async (message) => {
      isProcessing.value = true
      
      try {
        // Analyze intent with AI
        const analysis = await AIService.analyzeIntent(message)
        console.log('🤖 AI Analysis:', analysis)

        let responseData = null
        let responseText = analysis.response

        // Execute appropriate action based on intent
        if (analysis.intent === 'exercise') {
          const bodyPart = analysis.bodyPart || ExerciseService.normalizeBodyPart(message)
          console.log('🎯 BodyPart detected:', bodyPart, 'from message:', message)
          responseData = await ExerciseService.getExercisesByBodyPart(bodyPart)
          responseText = await AIService.generatePersonalizedResponse({
            intent: 'exercise',
            data: responseData,
            userInput: message
          })
        } else if (analysis.intent === 'nutrition') {
          if (analysis.mealType === 'motivational') {
            responseData = await NutritionService.getMotivationalAdvice()
          } else {
            const mealType = analysis.mealType || NutritionService.normalizeMealType(message)
            responseData = await NutritionService.getNutritionAdvice(mealType)
          }
          responseText = await AIService.generatePersonalizedResponse({
            intent: 'nutrition',
            data: responseData,
            userInput: message
          })
        } else if (analysis.intent === 'motivation') {
          responseData = await NutritionService.getMotivationalAdvice()
          responseText = await AIService.generatePersonalizedResponse({
            intent: 'motivation',
            data: responseData,
            userInput: message
          })
        }

        // Add bot message to chat interface
        if (chatInterface.value) {
          chatInterface.value.addBotMessage(responseText, true)
        }

        // Format and speak the response
        const formattedResponse = speechService.value.formatResponse(responseText)
        
        // Speak with appropriate emotion
        const emotion = analysis.intent === 'motivation' ? 'encouraging' : 
                       analysis.intent === 'exercise' ? 'excited' : 'calm'
        
        await speechService.value.speakWithEmotion(formattedResponse, emotion)

        // Log the interaction with specific methods
        if (analysis.intent === 'exercise' && responseData) {
          await LoggingService.logExerciseRecommendation(
            responseData, 
            analysis.bodyPart
          )
        } else if (analysis.intent === 'nutrition' && responseData) {
          await LoggingService.logNutritionSuggestion(
            responseData, 
            analysis.mealType,
            null // calories - could be calculated from responseData
          )
        } else {
          // For general queries, voice queries, and motivation
          await LoggingService.logVoiceQuery(message, analysis.confidence || 0.8)
        }

        // Also log the general interaction
        await LoggingService.logUserInteraction({
          userInput: message,
          botResponse: responseText,
          actionType: analysis.intent,
          confidence: analysis.confidence,
          metadata: {
            bodyPart: analysis.bodyPart,
            mealType: analysis.mealType,
            dataReturned: !!responseData
          }
        })

      } catch (error) {
        console.error('❌ Error processing message:', error)
        const errorMessage = 'Lo siento, hubo un problema procesando tu solicitud. ¿Puedes intentar de nuevo?'
        
        if (chatInterface.value) {
          chatInterface.value.addBotMessage(errorMessage, false)
        }
        
        await speechService.value.speak(errorMessage)
      } finally {
        isProcessing.value = false
      }
    }

    const handleVoiceToggle = () => {
      if (!voiceService.value?.isSupported) {
        alert('Lo siento, tu navegador no soporta reconocimiento de voz. Intenta con Chrome o Edge.')
        return
      }

      if (isListening.value) {
        voiceService.value.stopListening()
      } else {
        try {
          voiceService.value.startListening()
        } catch (error) {
          console.error('Error starting voice recognition:', error)
          alert('Error al activar el micrófono. Verifica los permisos.')
        }
      }
    }

    onMounted(() => {
      initializeServices()
      
      // Welcome message
      setTimeout(async () => {
        const welcomeMessage = '¡Hola! Soy tu entrenador personal virtual. Puedo ayudarte con ejercicios, nutrición y motivación. ¿En qué te puedo ayudar hoy?'
        await speechService.value?.speak(welcomeMessage)
      }, 1000)
    })

    onUnmounted(() => {
      // Cleanup
      if (voiceService.value) {
        voiceService.value.stopListening()
      }
      if (speechService.value) {
        speechService.value.stop()
      }
    })

    return {
      isListening,
      isProcessing,
      chatInterface,
      handleUserMessage,
      handleVoiceToggle
    }
  }
}
</script>

<style scoped>
.voicebot-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.app-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

.chat-container {
  flex: 1;
  padding: 2rem 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.app-footer {
  background: #343a40;
  color: #adb5bd;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
}

.app-footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>