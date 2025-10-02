# 🏋️‍♂️ Voicebot Personal Trainer

Un entrenador personal virtual con inteligencia artificial y control por voz que te ayuda con ejercicios, nutrición y motivación.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.4+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Enabled-green?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## � Características

- **🎤 Control por voz**: Habla naturalmente para hacer consultas
- **🤖 IA avanzada**: Powered by Google Gemini para respuestas inteligentes
- **🏋️ Ejercicios personalizados**: Rutinas basadas en parte del cuerpo
- **🥗 Consejos nutricionales**: Recomendaciones alimentarias personalizadas  
- **💪 Motivación**: Mensajes inspiradores cuando los necesites
- **🎯 Selector de voz**: Múltiples narradores disponibles
- **📊 Analytics**: Logging automático de interacciones
- **🧪 Testing integrado**: Verificación del estado de APIs

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js)
- Un navegador moderno que soporte Web Speech API (Chrome recomendado)

## � Instalación y Configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/iRivalAether/voicebot-trainer.git
cd voicebot-trainer
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto copiando el ejemplo:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura tus API keys:

```env
# Google Gemini API Key (REQUERIDO)
VITE_GEMINI_API_KEY=tu_gemini_api_key_aqui

# RapidAPI Key para ExerciseDB (OPCIONAL)
VITE_RAPIDAPI_KEY=tu_rapidapi_key_aqui

# Webhook URL para logging (OPCIONAL)
VITE_WEBHOOK_URL=https://tu-webhook-url.com

# Configuración de la app
VITE_APP_NAME=Voicebot Personal Trainer
VITE_APP_VERSION=1.0.0
```

### 4. Obtén las API Keys necesarias

#### 🔑 Google Gemini API (OBLIGATORIO)

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto o usa uno existente
4. Genera una API key
5. Copia la key en `VITE_GEMINI_API_KEY`

#### 🏋️ RapidAPI ExerciseDB (OPCIONAL)

1. Ve a [RapidAPI ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
2. Crea una cuenta gratuita
3. Suscríbete al plan gratuito
4. Copia tu API key en `VITE_RAPIDAPI_KEY`

*Nota: Si no configuras esta API, el sistema usará ejercicios predefinidos como fallback.*

#### 🌐 Webhook para Analytics (OPCIONAL)

Puedes usar cualquiera de estas opciones:

- **Pipedream**: [pipedream.com](https://pipedream.com) (Recomendado)
- **Webhook.site**: [webhook.site](https://webhook.site) (Para testing)
- **RequestBin**: [requestbin.com](https://requestbin.com)

### 5. Inicia el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 🎮 Cómo usar el Voicebot

### 📱 Interfaz

1. **Selector de voz**: En la parte superior, elige tu narrador preferido
2. **Botón de voz** 🎤: Haz clic para activar el reconocimiento de voz
3. **Input de texto**: Alternativamente, puedes escribir tus consultas
4. **Test APIs** 🧪: Botón para verificar el estado de las integraciones

### �️ Comandos de voz

Puedes hablar naturalmente, por ejemplo:

**Para ejercicios:**
- "Dame ejercicios para brazos"
- "Rutina de piernas" 
- "Ejercicios de abdomen"
- "Workout para espalda"

**Para nutrición:**
- "Qué puedo comer en el desayuno"
- "Consejos para la cena"
- "Dieta saludable"
- "Opciones de snack"

**Para motivación:**
- "Necesito motivación"
- "Dame ánimos"
- "Consejos motivacionales"

### ⏱️ Timeout automático

El sistema automáticamente para la grabación después de 3 segundos de silencio.

## 🧪 Testing

### Test automático de APIs

Haz clic en el botón "🧪 Test APIs" para verificar:
- ✅ Conexión con Gemini AI
- ✅ Estado de ExerciseDB API
- ✅ Funcionamiento del webhook
- ✅ Integración completa

### Test manual

```bash
# Ejecutar tests unitarios (si los hay)
npm run test

# Verificar el build
npm run build
```

## 📁 Estructura del proyecto

```
voicebot-trainer/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes Vue
│   │   └── ChatInterface.vue
│   ├── services/          # Servicios de integración
│   │   ├── aiService.js       # Google Gemini
│   │   ├── exerciseService.js # ExerciseDB API
│   │   ├── nutritionService.js
│   │   ├── speechService.js   # Text-to-Speech
│   │   ├── voiceService.js    # Speech-to-Text
│   │   └── loggingService.js  # Analytics
│   ├── utils/             # Utilidades
│   │   └── apiTest.js         # Testing de APIs
│   ├── App.vue            # Componente principal
│   ├── main.js            # Punto de entrada
│   └── style.css          # Estilos globales
├── .env.example           # Ejemplo de configuración
├── package.json           # Dependencias
├── vite.config.js         # Configuración de Vite
└── README.md             # Esta documentación
```

## 🛠️ Scripts disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build           # Genera build para producción
npm run preview         # Preview del build

# Utilidades
npm run lint            # Linter de código
npm run format          # Formatea código
```

## 🔧 Troubleshooting

### Problema: "AI model not available"
**Solución:** Verifica que `VITE_GEMINI_API_KEY` esté configurado correctamente en `.env`

### Problema: "Speech recognition not supported"
**Solución:** 
- Usa Chrome o Edge (navegadores compatibles)
- Asegúrate de que el sitio use HTTPS en producción
- Permite el acceso al micrófono

### Problema: ExerciseDB devuelve 403
**Solución:**
- Verifica tu RapidAPI key
- Revisa los límites de tu plan gratuito
- El sistema funcionará con datos de fallback si falla

### Problema: Webhook no funciona
**Solución:**
- Verifica que la URL del webhook sea correcta
- Los logs se guardarán localmente si el webhook falla

## 🚀 Deployment

### Para producción:

1. **Build del proyecto:**
```bash
npm run build
```

2. **Subir a tu servidor web:**
Los archivos de `dist/` contienen la aplicación lista para producción.

3. **Configurar HTTPS:**
El reconocimiento de voz requiere HTTPS en producción.

### Opciones de hosting:

- **Netlify** (Recomendado para SPA)
- **Vercel**  
- **GitHub Pages**
- **Firebase Hosting**

## 📊 Analytics y Logging

La aplicación automáticamente registra:
- Consultas de voz del usuario
- Respuestas generadas
- Recomendaciones de ejercicios
- Consejos nutricionales
- Métricas de uso

Los datos se envían al webhook configurado en tiempo real.
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

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**iRivalAether**
- GitHub: [@iRivalAether](https://github.com/iRivalAether)

## 🙏 Agradecimientos

- Google Gemini AI por la inteligencia artificial
- ExerciseDB por la base de datos de ejercicios
- Web Speech API por las capacidades de voz
- Vue.js por el framework de frontend

---

### � ¿Necesitas ayuda?

Si tienes problemas o preguntas:

1. 🧪 Usa el botón "Test APIs" en la aplicación
2. 📋 Revisa este README
3. 🐛 Abre un issue en GitHub
4. 📧 Contacta al autor

¡Disfruta de tu entrenador personal virtual! 💪

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