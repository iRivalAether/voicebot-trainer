import { GoogleGenerativeAI } from '@google/generative-ai';

// AI service using Google Gemini for intent recognition and response generation
class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
  }

  async analyzeIntent(userInput) {
    if (!this.model) {
      throw new Error('AI model not available. Please check your Gemini API key.');
    }

    try {
      const prompt = `
Analiza la siguiente solicitud de un usuario para un asistente de entrenamiento personal y nutrición.
Determina la intención y proporciona una respuesta en JSON:

Usuario dice: "${userInput}"

Responde SOLO con un JSON válido con esta estructura:
{
  "intent": "exercise|nutrition|motivation|general",
  "bodyPart": "chest|back|legs|arms|shoulders|null",
  "mealType": "desayuno|almuerzo|cena|snack|null", 
  "action": "recommend|motivate|advice",
  "confidence": 0.85,
  "response": "Respuesta natural del entrenador personal"
}

Reglas:
- Si pide ejercicios, intent="exercise" y especifica bodyPart (incluye "abs" para abdomen/abdominales)
- Si pide comida/dieta, intent="nutrition" y especifica mealType  
- Si pide motivación/ánimos, intent="motivation"
- La respuesta debe ser natural y conversacional, como hablaría un entrenador personal real
- Usa un tono amigable, cercano y profesional en español
- NO uses emojis ni caracteres especiales, solo texto natural
- Habla como si fueras una persona real conversando
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  }

  async generatePersonalizedResponse(context) {
    if (!this.model) {
      throw new Error('AI model not available. Please check your Gemini API key.');
    }

    try {
      const { intent, data, userInput } = context;
      
      let prompt = '';
      
      if (intent === 'exercise' && data) {
        prompt = `
Como entrenador personal profesional, presenta estos ejercicios de manera motivadora:

Ejercicios: ${JSON.stringify(data)}
Solicitud original: "${userInput}"

Crea una respuesta natural que:
1. Sea conversacional y motivadora, como si fueras una persona real
2. Explique brevemente cada ejercicio de forma simple
3. Incluya tips de seguridad importantes
4. Use un tono cercano y profesional, sin exagerar
5. NO uses emojis ni caracteres especiales, solo texto natural
6. Mantén la respuesta concisa pero completa (máximo 200 palabras)
`;
      } 
      else if (intent === 'nutrition' && data) {
        prompt = `
Como nutricionista profesional, presenta estos consejos nutricionales:

Información: ${JSON.stringify(data)}  
Solicitud original: "${userInput}"

Crea una respuesta que:
1. Sea conversacional y motivadora, como una charla entre amigos
2. Explique los beneficios de forma simple y clara
3. Sea práctica y fácil de seguir en la vida diaria
4. Use un tono cercano y profesional
5. NO uses emojis ni caracteres especiales, solo texto natural
6. Máximo 200 palabras
`;
      }
      else if (intent === 'motivation' && data) {
        prompt = `
Como coach motivacional para fitness, transforma este consejo en algo inspirador:

Consejo: "${data.advice || data}"
Contexto: Usuario pidió motivación

Crea una respuesta que:
1. Sea genuinamente motivadora y conversacional
2. Se relacione con fitness y bienestar personal
3. Sea empática y cercana, como un amigo que te apoya
4. Incluya un llamado a la acción realista
5. NO uses emojis ni caracteres especiales, solo texto natural
6. Máximo 150 palabras
`;
      }

      if (prompt) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
      }

      throw new Error('No appropriate prompt generated for this context');
      
    } catch (error) {
      console.error('Response generation error:', error);
      throw error;
    }
  }
}

export default new AIService();