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
    console.log('🌐 Testing Pipedream Webhook...')
    
    try {
      const testData = {
        type: 'api_test',
        session_id: 'test-session-' + Date.now(),
        user_id: 'test-user',
        timestamp: new Date().toISOString(),
        test_message: 'API Test from voicebot-trainer',
        data: { test: true, apis_tested: ['gemini', 'exerciseDB', 'nutrition'] }
      }
      
      const result = await LoggingService.sendToWebhook(testData)
      
      this.results.webhook.status = result.success ? 'success' : 'error'
      this.results.webhook.data = result
      
      if (result.success) {
        console.log('✅ Pipedream Webhook: SUCCESS')
        console.log('   Data sent successfully to RequestBin')
      } else {
        console.error('❌ Pipedream Webhook: FAILED')
        console.error('   Error:', result.error)
      }
      
      return result.success
    } catch (error) {
      this.results.webhook.status = 'error'
      this.results.webhook.error = error.message
      
      console.error('❌ Pipedream Webhook: FAILED')
      console.error('   Error:', error.message)
      
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

  getResults() {
    return this.results
  }
}

export default APITester