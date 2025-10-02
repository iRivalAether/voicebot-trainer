// API service for exercise-related queries
class ExerciseService {
  constructor() {
    this.baseUrl = 'https://exercisedb.p.rapidapi.com';
    // Note: You'll need to get a free API key from RapidAPI
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY || '';
  }

  async getExercisesByBodyPart(bodyPart) {
    try {
      if (!this.apiKey || !bodyPart || bodyPart === 'null') {
        // Fallback with predefined exercises if no API key or invalid bodyPart
        return this.getFallbackExercises(bodyPart);
      }

      const response = await fetch(`${this.baseUrl}/exercises/bodyPart/${bodyPart}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }

      const exercises = await response.json();
      return exercises.slice(0, 3); // Return top 3 exercises
    } catch (error) {
      console.error('Exercise API error:', error);
      return this.getFallbackExercises(bodyPart);
    }
  }

  getFallbackExercises(bodyPart) {
    const exercises = {
      chest: [
        { name: 'Push-ups', instructions: 'Start in plank position, lower body to ground, push back up', equipment: 'body weight' },
        { name: 'Chest Press', instructions: 'Lie on bench, press weights up from chest level', equipment: 'dumbbells' }
      ],
      back: [
        { name: 'Pull-ups', instructions: 'Hang from bar, pull body up until chin over bar', equipment: 'pull-up bar' },
        { name: 'Bent-over Row', instructions: 'Bend at waist, pull weights to chest', equipment: 'dumbbells' }
      ],
      shoulders: [
        { name: 'Shoulder Press', instructions: 'Press weights overhead from shoulder level', equipment: 'dumbbells' },
        { name: 'Lateral Raises', instructions: 'Lift weights to sides until arms parallel to floor', equipment: 'dumbbells' }
      ],
      legs: [
        { name: 'Squats', instructions: 'Lower body as if sitting in chair, return to standing', equipment: 'body weight' },
        { name: 'Lunges', instructions: 'Step forward, lower back knee toward ground, return to start', equipment: 'body weight' }
      ],
      arms: [
        { name: 'Bicep Curls', instructions: 'Curl weights up to shoulders, lower slowly', equipment: 'dumbbells' },
        { name: 'Tricep Dips', instructions: 'Lower body by bending arms, push back up', equipment: 'chair or bench' }
      ],
      abs: [
        { name: 'Planks', instructions: 'Hold plank position on forearms, keep body straight', equipment: 'body weight' },
        { name: 'Crunches', instructions: 'Lie on back, lift shoulders toward knees', equipment: 'body weight' },
        { name: 'Mountain Climbers', instructions: 'In plank position, alternate bringing knees to chest', equipment: 'body weight' }
      ]
    };

    return exercises[bodyPart] || exercises.abs;
  }

  normalizeBodyPart(userInput) {
    const bodyPartMap = {
      'brazos': 'arms',
      'brazo': 'arms',
      'arms': 'arms',
      'piernas': 'legs',
      'pierna': 'legs',
      'legs': 'legs',
      'pecho': 'chest',
      'chest': 'chest',
      'espalda': 'back',
      'back': 'back',
      'hombros': 'shoulders',
      'hombro': 'shoulders',
      'shoulders': 'shoulders',
      'abdomen': 'abs',
      'abdominal': 'abs',
      'abdominales': 'abs',
      'abs': 'abs',
      'core': 'abs'
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, value] of Object.entries(bodyPartMap)) {
      if (lowerInput.includes(key)) {
        return value;
      }
    }
    return 'chest'; // default
  }
}

export default new ExerciseService();