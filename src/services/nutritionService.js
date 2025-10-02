// Nutrition and diet service
class NutritionService {
  constructor() {
    // Using a simple advice API that doesn't require authentication
    this.adviceUrl = 'https://api.adviceslip.com/advice';
  }

  async getNutritionAdvice(mealType = 'general') {
    try {
      // Since nutrition APIs often require API keys, we'll provide structured advice
      return this.getFallbackNutritionAdvice(mealType);
    } catch (error) {
      console.error('Nutrition API error:', error);
      return this.getFallbackNutritionAdvice(mealType);
    }
  }

  getFallbackNutritionAdvice(mealType) {
    const nutritionAdvice = {
      desayuno: {
        title: 'Desayuno Saludable',
        suggestions: [
          'Avena con frutas y nueces',
          'Huevos revueltos con espinacas',
          'Yogur griego con berries',
          'Tostada integral con aguacate'
        ],
        tips: 'Incluye proteína y fibra para mantener energía durante la mañana'
      },
      almuerzo: {
        title: 'Almuerzo Nutritivo',
        suggestions: [
          'Ensalada de pollo a la parrilla',
          'Salmón con quinoa y vegetales',
          'Bowl de quinoa con frijoles y aguacate',
          'Pechuga de pollo con arroz integral'
        ],
        tips: 'Combina proteínas magras con carbohidratos complejos'
      },
      cena: {
        title: 'Cena Ligera',
        suggestions: [
          'Pescado al vapor con brócoli',
          'Ensalada verde con nueces',
          'Sopa de vegetales con proteína',
          'Tofu salteado con vegetales'
        ],
        tips: 'Mantén las cenas ligeras, ricas en vegetales y proteína'
      },
      snack: {
        title: 'Snack Saludable',
        suggestions: [
          'Almendras y una manzana',
          'Yogur natural con granola',
          'Hummus con vegetales',
          'Batido de proteína con frutas'
        ],
        tips: 'Elige snacks que combinen proteína con fibra'
      },
      general: {
        title: 'Consejos Nutricionales',
        suggestions: [
          'Bebe al menos 2 litros de agua al día',
          'Incluye 5 porciones de frutas y verduras diarias',
          'Limita el azúcar procesado y harinas refinadas',
          'Come proteína en cada comida principal'
        ],
        tips: 'Una alimentación balanceada es clave para tu salud'
      }
    };

    return nutritionAdvice[mealType] || nutritionAdvice.general;
  }

  async getMotivationalAdvice() {
    try {
      const response = await fetch(this.adviceUrl);
      const data = await response.json();
      return {
        advice: data.slip.advice,
        type: 'motivational'
      };
    } catch (error) {
      console.error('Motivational advice error:', error);
      return {
        advice: this.getFallbackMotivation(),
        type: 'motivational'
      };
    }
  }

  getFallbackMotivation() {
    const motivationalMessages = [
      "Tu cuerpo puede hacerlo. Es tu mente la que necesitas convencer.",
      "El progreso, no la perfección, es lo que importa.",
      "Cada día es una nueva oportunidad para ser mejor.",
      "La disciplina es hacer lo que necesitas hacer, incluso cuando no quieres.",
      "Los grandes resultados requieren grandes ambiciones.",
      "Tu única competencia eres tú mismo de ayer.",
      "El dolor es temporal, pero el orgullo dura para siempre.",
      "No se trata de ser perfecto, se trata de ser mejor."
    ];

    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  }

  normalizeMealType(userInput) {
    const mealMap = {
      'desayuno': 'desayuno',
      'breakfast': 'desayuno',
      'almuerzo': 'almuerzo',
      'comida': 'almuerzo',
      'lunch': 'almuerzo',
      'cena': 'cena',
      'dinner': 'cena',
      'snack': 'snack',
      'merienda': 'snack',
      'motivacion': 'motivational',
      'motivation': 'motivational'
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, value] of Object.entries(mealMap)) {
      if (lowerInput.includes(key)) {
        return value;
      }
    }
    return 'general';
  }
}

export default new NutritionService();