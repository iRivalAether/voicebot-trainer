// Logging service for user interactions
class LoggingService {
  constructor() {
    // You can replace this with your Pipedream RequestBin URL
    this.webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://webhook.site/your-unique-id';
  }

  async logUserInteraction(interaction) {
    const logEntry = {
      type: this.mapActionType(interaction.actionType),
      session_id: this.getSessionId(),
      user_id: this.getUserId(),
      timestamp: new Date().toISOString(),
      query: interaction.userInput,
      bot_response: interaction.botResponse,
      action_type: interaction.actionType, // 'exercise', 'nutrition', 'motivation'
      confidence: interaction.confidence || 0.8,
      language: 'es',
      metadata: {
        ...interaction.metadata,
        user_agent: navigator.userAgent,
        url: window.location.href,
        interaction_duration: interaction.duration || null
      }
    };

    try {
      if (this.webhookUrl.includes('your-unique-id')) {
        // If no real webhook URL is provided, log to console
        console.log('📊 User Interaction Log:', logEntry);
        return { success: true, logged: 'console' };
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      });

      if (response.ok) {
        console.log('✅ Interaction logged successfully');
        return { success: true, logged: 'webhook' };
      } else {
        throw new Error('Webhook request failed');
      }
    } catch (error) {
      console.error('Logging error:', error);
      // Fallback to local storage
      this.logToLocalStorage(logEntry);
      return { success: true, logged: 'localStorage' };
    }
  }

  logToLocalStorage(logEntry) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('voicebot-logs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 50 entries to avoid storage issues
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('voicebot-logs', JSON.stringify(existingLogs));
      console.log('📱 Logged to localStorage');
    } catch (error) {
      console.error('localStorage logging error:', error);
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('voicebot-session-id');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('voicebot-session-id', sessionId);
    }
    return sessionId;
  }

  getUserId() {
    let userId = localStorage.getItem('voicebot-user-id');
    if (!userId) {
      userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('voicebot-user-id', userId);
    }
    return userId;
  }

  mapActionType(actionType) {
    const typeMapping = {
      'exercise': 'exercise_recommendation',
      'nutrition': 'nutrition_suggestion', 
      'motivation': 'motivation_message',
      'general': 'voice_query'
    };
    return typeMapping[actionType] || 'voice_query';
  }

  getStoredLogs() {
    try {
      return JSON.parse(localStorage.getItem('voicebot-logs') || '[]');
    } catch (error) {
      console.error('Error retrieving logs:', error);
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem('voicebot-logs');
    console.log('🗑️ Logs cleared');
  }

  // Método específico para consultas de voz
  async logVoiceQuery(query, confidence = 0.8) {
    const data = {
      type: 'voice_query',
      session_id: this.getSessionId(),
      user_id: this.getUserId(),
      timestamp: new Date().toISOString(),
      query: query,
      confidence: confidence,
      language: 'es'
    };

    return await this.sendToWebhook(data);
  }

  // Método específico para recomendaciones de ejercicios
  async logExerciseRecommendation(exercises, workoutType = null) {
    const data = {
      type: 'exercise_recommendation',
      session_id: this.getSessionId(),
      user_id: this.getUserId(),
      timestamp: new Date().toISOString(),
      exercises: exercises,
      workout_type: workoutType,
      difficulty: 'intermedio' // Podrías hacer esto dinámico
    };

    return await this.sendToWebhook(data);
  }

  // Método específico para sugerencias nutricionales
  async logNutritionSuggestion(meals, mealType = null, calories = null) {
    const data = {
      type: 'nutrition_suggestion',
      session_id: this.getSessionId(),
      user_id: this.getUserId(),
      timestamp: new Date().toISOString(),
      meals: meals,
      meal_type: mealType,
      calories: calories
    };

    return await this.sendToWebhook(data);
  }

  // Método auxiliar para enviar datos al webhook
  async sendToWebhook(data) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('✅ Data sent to RequestBin successfully');
        return { success: true, logged: 'webhook' };
      } else {
        throw new Error('Webhook request failed');
      }
    } catch (error) {
      console.error('Webhook error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new LoggingService();