// Test de APIs para verificar que todas las integraciones funcionen correctamente

import AIService from '../services/aiService.js'
import ExerciseService from '../services/exerciseService.js'
import NutritionService from '../services/nutritionService.js'
import LoggingService from '../services/loggingService.js'

class APITester {
  constructor() {
    this.results = {
      gemini: { status: 'pending', data: null, error: null },
      exerciseDB: { status: 'pending', data: null, error: null },
      nutrition: { status: 'pending', data: null, error: null },
      webhook: { status: 'pending', data: null, error: null }
    }
  }

  async testGeminiAPI() {
    console.log('🤖 Testing Gemini AI API...')
    
    try {
      const testMessage = "Dame ejercicios para brazos"
      const result = await AIService.analyzeIntent(testMessage)
      
      this.results.gemini.status = 'success'
      this.results.gemini.data = result
      
      console.log('✅ Gemini AI: SUCCESS')
      console.log('   Intent:', result.intent)
      console.log('   Body Part:', result.bodyPart)
      console.log('   Confidence:', result.confidence)
      console.log('   Response preview:', result.response.substring(0, 100) + '...')
      
      return true
    } catch (error) {
      this.results.gemini.status = 'error'
      this.results.gemini.error = error.message
      
      console.error('❌ Gemini AI: FAILED')
      console.error('   Error:', error.message)
      
      return false
    }
  }

  async testExerciseAPI() {
    console.log('🏋️ Testing ExerciseDB API...')
    
    try {
      const exercises = await ExerciseService.getExercisesByBodyPart('arms')
      
      this.results.exerciseDB.status = 'success'
      this.results.exerciseDB.data = exercises
      
      console.log('✅ ExerciseDB: SUCCESS')
      console.log('   Exercises found:', exercises.length)
      console.log('   First exercise:', exercises[0]?.name || 'None')
      
      return true
    } catch (error) {
      this.results.exerciseDB.status = 'error'
      this.results.exerciseDB.error = error.message
      
      console.error('❌ ExerciseDB: FAILED')
      console.error('   Error:', error.message)
      
      return false
    }
  }

  async testNutritionService() {
    console.log('🥗 Testing Nutrition Service...')
    
    try {
      const nutritionAdvice = await NutritionService.getNutritionAdvice('desayuno')
      
      this.results.nutrition.status = 'success'
      this.results.nutrition.data = nutritionAdvice
      
      console.log('✅ Nutrition Service: SUCCESS')
      console.log('   Suggestions found:', nutritionAdvice.suggestions?.length || 0)
      console.log('   Tips available:', !!nutritionAdvice.tips)
      
      return true
    } catch (error) {
      this.results.nutrition.status = 'error'
      this.results.nutrition.error = error.message
      
      console.error('❌ Nutrition Service: FAILED')
      console.error('   Error:', error.message)
      
      return false
    }
  }

  async testWebhookAPI() {
    console.log('🌐 Testing Pipedream RequestBin Webhook...')
    
    try {
      const testData = {
        type: 'requestbin_test',
        session_id: 'test-session-' + Date.now(),
        user_id: 'test-user-' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        test_message: 'RequestBin Test from Voicebot Trainer',
        app_version: '1.0.0',
        test_details: {
          browser: navigator.userAgent,
          url: window.location.href,
          timestamp_readable: new Date().toLocaleString('es-ES'),
          apis_tested: ['gemini', 'exerciseDB', 'nutrition'],
          test_purpose: 'Verificar que los datos lleguen correctamente a Pipedream'
        },
        sample_interaction: {
          user_query: 'Dame ejercicios para brazos',
          bot_response: 'Te recomiendo hacer flexiones y curl de bíceps',
          detected_intent: 'exercise',
          body_part: 'arms'
        }
      }
      
      console.log('📤 Sending test data to Pipedream RequestBin...')
      console.log('🔗 RequestBin URL:', LoggingService.webhookUrl)
      
      const result = await LoggingService.sendToWebhook(testData)
      
      this.results.webhook.status = result.success ? 'success' : 'error'
      this.results.webhook.data = result
      
      if (result.success) {
        console.log('✅ Pipedream RequestBin: SUCCESS')
        console.log('   ✓ Data sent successfully to your RequestBin')
        console.log('   🔗 Check your Pipedream dashboard: https://pipedream.com/')
        console.log('   📋 Look for data type: "requestbin_test"')
        console.log('   🕐 Sent at:', new Date().toLocaleString('es-ES'))
      } else {
        console.error('❌ Pipedream RequestBin: FAILED')
        console.error('   Error:', result.error)
        console.error('   🔧 Check your VITE_WEBHOOK_URL in .env file')
      }
      
      return result.success
    } catch (error) {
      this.results.webhook.status = 'error'
      this.results.webhook.error = error.message
      
      console.error('❌ Pipedream RequestBin: FAILED')
      console.error('   Error:', error.message)
      console.error('   🔧 Verify your RequestBin URL and internet connection')
      
      return false
    }
  }

  async testFullIntegration() {
    console.log('🔄 Testing Full Integration...')
    
    try {
      // 1. Test user message analysis
      const userMessage = "Quiero ejercicios para abdomen"
      const analysis = await AIService.analyzeIntent(userMessage)
      
      // 2. Get exercise data based on analysis
      const bodyPart = analysis.bodyPart || 'abs'
      const exerciseData = await ExerciseService.getExercisesByBodyPart(bodyPart)
      
      // 3. Generate personalized response
      const personalizedResponse = await AIService.generatePersonalizedResponse({
        intent: 'exercise',
        data: exerciseData,
        userInput: userMessage
      })
      
      // 4. Log the interaction
      await LoggingService.logExerciseRecommendation(exerciseData, bodyPart)
      
      console.log('✅ Full Integration: SUCCESS')
      console.log('   User message:', userMessage)
      console.log('   Detected intent:', analysis.intent)
      console.log('   Body part:', bodyPart)
      console.log('   Exercises found:', exerciseData.length)
      console.log('   Response length:', personalizedResponse.length, 'characters')
      
      return true
    } catch (error) {
      console.error('❌ Full Integration: FAILED')
      console.error('   Error:', error.message)
      
      return false
    }
  }

  async runAllTests() {
    console.log('🚀 Starting API Tests...')
    console.log('=' * 50)
    
    const startTime = Date.now()
    
    // Test each API individually
    const geminiOK = await this.testGeminiAPI()
    console.log('')
    
    const exerciseOK = await this.testExerciseAPI()
    console.log('')
    
    const nutritionOK = await this.testNutritionService()
    console.log('')
    
    const webhookOK = await this.testWebhookAPI()
    console.log('')
    
    // Test full integration if individual tests pass
    let integrationOK = false
    if (geminiOK && (exerciseOK || nutritionOK)) {
      integrationOK = await this.testFullIntegration()
    } else {
      console.log('⏭️ Skipping integration test due to failed dependencies')
    }
    
    const endTime = Date.now()
    const totalTime = endTime - startTime
    
    // Summary
    console.log('')
    console.log('📊 TEST SUMMARY')
    console.log('=' * 30)
    console.log(`🤖 Gemini AI:      ${geminiOK ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`🏋️ ExerciseDB:     ${exerciseOK ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`🥗 Nutrition:      ${nutritionOK ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`🌐 Webhook:        ${webhookOK ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`🔄 Integration:    ${integrationOK ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`⏱️ Total time:     ${totalTime}ms`)
    
    const passedTests = [geminiOK, exerciseOK, nutritionOK, webhookOK, integrationOK].filter(Boolean).length
    console.log(`📈 Success rate:   ${passedTests}/5 (${Math.round(passedTests/5*100)}%)`)
    
    return {
      results: this.results,
      summary: {
        gemini: geminiOK,
        exercise: exerciseOK,
        nutrition: nutritionOK,
        webhook: webhookOK,
        integration: integrationOK,
        totalTime,
        successRate: passedTests / 5
      }
    }
  }

  // Método específico para probar solo el RequestBin
  async testRequestBinOnly() {
    console.log('🎯 TESTING ONLY PIPEDREAM REQUESTBIN')
    console.log('=' * 40)
    
    const testData = {
      type: 'manual_requestbin_test',
      session_id: 'manual-test-' + Date.now(),
      user_id: 'manual-user-' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      manual_test: true,
      message: 'Este es un test manual del RequestBin de Pipedream',
      details: {
        purpose: 'Verificar que los datos lleguen correctamente',
        expected_result: 'Datos visibles en el dashboard de Pipedream',
        browser_info: navigator.userAgent,
        page_url: window.location.href,
        test_time: new Date().toLocaleString('es-ES', {
          timeZone: 'America/Mexico_City',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
    }
    
    try {
      console.log('📤 Enviando datos de prueba...')
      const result = await LoggingService.sendToWebhook(testData)
      
      if (result.success) {
        console.log('')
        console.log('🎉 ¡SUCCESS! RequestBin funcionando correctamente')
        console.log('✅ Los datos se enviaron a tu Pipedream RequestBin')
        console.log('🔗 Ve a https://pipedream.com/ para ver los datos')
        console.log('📋 Busca el evento con type: "manual_requestbin_test"')
        console.log('🕐 Enviado a las:', new Date().toLocaleString('es-ES'))
        console.log('')
        console.log('💡 CÓMO VERIFICAR EN PIPEDREAM:')
        console.log('   1. Entra a pipedream.com')
        console.log('   2. Ve a tu workspace')
        console.log('   3. Busca tu RequestBin (URL: https://eo4icjjsfx28yrq.m.pipedream.net)')
        console.log('   4. Deberías ver el evento recién enviado')
        
        return true
      } else {
        console.error('')
        console.error('❌ ERROR: RequestBin no está funcionando')
        console.error('🔧 Posibles soluciones:')
        console.error('   1. Verifica tu VITE_WEBHOOK_URL en el archivo .env')
        console.error('   2. Asegúrate de que la URL sea: https://eo4icjjsfx28yrq.m.pipedream.net')
        console.error('   3. Verifica tu conexión a internet')
        console.error('   4. Revisa si el RequestBin sigue activo en Pipedream')
        
        return false
      }
    } catch (error) {
      console.error('🔥 ERROR FATAL:', error.message)
      return false
    }
  }

  getResults() {
    return this.results
  }
}

export default APITester