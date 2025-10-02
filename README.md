# 🏋️‍♂️ Voicebot Entrenador Personal Virtual

Un asistente de entrenamiento personal con inteligencia artificial que responde por voz, construido con Vue.js 3 y APIs de fitness/nutrición.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.4+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Enabled-green?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 🎯 Características Principales

- **🎤 Reconocimiento de Voz**: Interacción completamente por voz usando Web Speech API
- **🔊 Síntesis de Voz**: Respuestas habladas con diferentes emociones y tonos
- **🤖 IA Multimodal**: Integración con Google Gemini para análisis de intención avanzado
- **🏋️ Ejercicios**: Consulta de rutinas y ejercicios específicos por grupo muscular
- **🥗 Nutrición**: Consejos nutricionales personalizados para desayuno, almuerzo, cena y snacks
- **💪 Motivación**: Mensajes motivacionales para mantener el ánimo
- **📊 Registro de Interacciones**: Logging automático de conversaciones para análisis

## 🚀 Demo en Vivo

[Ver Demo](https://your-deployment-url.vercel.app) | [Video Demo](https://your-video-link.com)

## 📋 Casos de Uso

### Ejercicios
- *"Dame ejercicios para brazos"*
- *"Rutina de piernas para principiantes"*
- *"Ejercicios de pecho sin equipo"*

### Nutrición
- *"Qué puedo desayunar saludable"*
- *"Dame ideas para una cena ligera"*
- *"Snacks saludables para después del gym"*

### Motivación
- *"Dame motivación para entrenar"*
- *"Necesito ánimos para seguir"*
- *"Consejos motivacionales"*

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 16+ 
- npm o yarn
- Navegador moderno (Chrome, Edge, Firefox) con soporte para Web Speech API

### Pasos de Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/voicebot-trainer.git
cd voicebot-trainer
```

2. **Instala las dependencias**
```bash
npm install
# o
yarn install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus API keys:

```env
# Google Gemini API Key (REQUERIDO para IA avanzada)
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui

# RapidAPI Key (OPCIONAL - tiene datos de respaldo)
VITE_RAPIDAPI_KEY=tu_rapidapi_key_aqui

# Webhook URL (OPCIONAL - por defecto usa localStorage)
VITE_WEBHOOK_URL=https://webhook.site/tu-id-unico
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abre tu navegador**
```
http://localhost:3000
```

## 🔑 Configuración de APIs

### Google Gemini API (Recomendado)

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Crea una cuenta y genera una API key
3. Agrega la key a `VITE_GEMINI_API_KEY` en tu archivo `.env`

### ExerciseDB API (Opcional)

1. Ve a [RapidAPI - ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
2. Suscríbete al plan gratuito
3. Agrega tu key a `VITE_RAPIDAPI_KEY` en tu archivo `.env`

*Nota: Si no configuras esta API, el sistema usa datos de ejercicios predefinidos.*

### Webhook para Logging (Opcional)

1. Ve a [Webhook.site](https://webhook.site/)
2. Copia tu URL única
3. Agrega la URL a `VITE_WEBHOOK_URL` en tu archivo `.env`

*Nota: Sin webhook, los logs se guardan en localStorage del navegador.*

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes Vue
│   └── ChatInterface.vue
├── services/           # Lógica de negocio
│   ├── aiService.js         # Google Gemini integration
│   ├── exerciseService.js   # ExerciseDB API
│   ├── nutritionService.js  # Consejos nutricionales
│   ├── voiceService.js      # Web Speech Recognition
│   ├── speechService.js     # Web Speech Synthesis
│   └── loggingService.js    # Webhook logging
├── style.css           # Estilos globales
├── App.vue            # Componente principal
└── main.js            # Entry point
```

### Flujo de Datos

```
Usuario habla/escribe
    ↓
Web Speech API → Texto
    ↓
Gemini AI → Análisis de intención
    ↓
Router → API apropiada (Exercise/Nutrition)
    ↓
Respuesta → Gemini AI (personalización)
    ↓
Speech Synthesis → Respuesta hablada
    ↓
Webhook → Log de interacción
```

## 🎨 Personalización

### Cambiar Idioma de Voz

```javascript
// En voiceService.js
this.recognition.lang = 'en-US'; // Para inglés
this.recognition.lang = 'es-MX'; // Para español mexicano
```

### Agregar Nuevos Ejercicios

```javascript
// En exerciseService.js - método getFallbackExercises()
const exercises = {
  // ... ejercicios existentes
  abs: [
    { name: 'Crunches', instructions: 'Lie down, lift shoulders off ground', equipment: 'body weight' }
  ]
};
```

### Modificar Respuestas de Nutrición

```javascript
// En nutritionService.js - método getFallbackNutritionAdvice()
const nutritionAdvice = {
  // ... consejos existentes
  postWorkout: {
    title: 'Post-Entrenamiento',
    suggestions: ['Batido de proteína', 'Plátano con mantequilla de almendra']
  }
};
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Instala Vercel CLI**
```bash
npm i -g vercel
```

2. **Despliega**
```bash
vercel --prod
```

3. **Configura variables de entorno** en el dashboard de Vercel

### Netlify

1. **Build del proyecto**
```bash
npm run build
```

2. **Sube la carpeta `dist`** a Netlify

3. **Configura variables** en Settings → Environment variables

### GitHub Pages

1. **Configura el repositorio** para Pages
2. **Usa GitHub Actions** con el workflow incluido en `.github/workflows/deploy.yml`

## 🧪 Testing

### Testing Manual

1. **Test de Voz**: Presiona "🎤 Hablar" y di "ejercicios para brazos"
2. **Test de Texto**: Escribe "qué puedo cenar" y presiona Enter
3. **Test de API**: Verifica las respuestas del bot en la consola del navegador

### Casos de Prueba

```javascript
// Ejercicios
"dame ejercicios para piernas"
"rutina de pecho"
"workout para espalda"

// Nutrición  
"qué desayunar saludable"
"comida ligera para cenar"
"snacks para after gym"

// Motivación
"dame motivación"
"necesito ánimos"
"consejos motivacionales"
```

## 🔧 Solución de Problemas

### El micrófono no funciona

- ✅ Verifica permisos de micrófono en el navegador
- ✅ Usa HTTPS (necesario para Web Speech API)
- ✅ Prueba en Chrome/Edge (mejor compatibilidad)

### La IA no responde correctamente

- ✅ Verifica que `VITE_GEMINI_API_KEY` esté configurada
- ✅ Revisa la consola para errores de API
- ✅ El sistema tiene respuestas de fallback automáticas

### No se guardan los logs

- ✅ Verifica `VITE_WEBHOOK_URL` en el archivo `.env`
- ✅ Los logs se guardan en localStorage como respaldo

## 📊 APIs Utilizadas

| API | Propósito | Requerida | Documentación |
|-----|-----------|-----------|---------------|
| Google Gemini | IA Multimodal | ❌ (tiene fallback) | [Docs](https://ai.google.dev/docs) |
| ExerciseDB | Base de ejercicios | ❌ (tiene fallback) | [Docs](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) |
| Advice Slip | Consejos motivacionales | ❌ | [Docs](https://api.adviceslip.com/) |
| Web Speech API | Reconocimiento de voz | ✅ | [Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) |
| Speech Synthesis | Texto a voz | ✅ | [Docs](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) |

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [tu-perfil](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- [Vue.js Team](https://vuejs.org/) por el excelente framework
- [Google AI](https://ai.google.dev/) por Gemini API
- [MDN Web Docs](https://developer.mozilla.org/) por la documentación de Web APIs
- [RapidAPI](https://rapidapi.com/) por las APIs de fitness

---

⭐ Si este proyecto te ayuda, ¡dale una estrella en GitHub! ⭐