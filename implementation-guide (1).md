# Guía de Implementación - Agenda Semanal

Esta guía te ayudará a implementar paso a paso la aplicación de Agenda Semanal desde cero.

## Índice

1. [Configuración inicial del proyecto](#1-configuración-inicial-del-proyecto)
2. [Estructura de archivos](#2-estructura-de-archivos)
3. [Implementación de componentes](#3-implementación-de-componentes)
4. [Configuración PWA](#4-configuración-pwa)
5. [Estilización con Tailwind CSS](#5-estilización-con-tailwind-css)
6. [Despliegue](#6-despliegue)
7. [Resolución de problemas comunes](#7-resolución-de-problemas-comunes)

## 1. Configuración inicial del proyecto

### Requisitos previos
- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior) o yarn

### Crear un nuevo proyecto React

```bash
# Crear proyecto con Create React App
npx create-react-app agenda-semanal

# Navegar al directorio del proyecto
cd agenda-semanal

# Instalar dependencias necesarias
npm install lucide-react recharts

# Instalar TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configurar Tailwind CSS

Edita el archivo `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [],
}
```

Modifica el archivo `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

## 2. Estructura de archivos

Crea la siguiente estructura de directorios y archivos:

```
src/
├── components/
│   ├── WeeklyPlanner.js
│   ├── MonthlyCalendar.js
│   ├── StatisticsPanel.js
│   ├── CustomTagSelector.js
│   ├── RecurringTaskOptions.js
│   ├── TaskImagePicker.js
│   ├── SearchFilter.js
│   └── UserAvatar.js
├── App.js
├── index.js
├── index.css
└── service-worker.js
```

## 3. Implementación de componentes

A continuación, debes implementar cada uno de los componentes. Todos los códigos están disponibles en nuestra conversación anterior. Aquí tienes un resumen:

### App.js

Este es el componente principal que integra todos los demás componentes. Contiene:
- Estados para gestionar tareas, vistas, panel seleccionado
- Barra lateral para navegación
- Integración de todos los componentes
- Sistema de notificaciones

### WeeklyPlanner.js

Componente para la vista semanal que incluye:
- Lista de tareas por día
- Funcionalidad para crear, editar y eliminar tareas
- Modal para editar/crear tareas con todas las opciones

### MonthlyCalendar.js

Componente para la vista mensual que muestra:
- Calendario en formato mensual
- Indicadores de tareas por día
- Navegación entre meses

### StatisticsPanel.js

Panel de estadísticas con:
- Gráficos de barras para tareas por día
- Gráficos circulares para categorías y prioridades
- Estadísticas generales de productividad

### CustomTagSelector.js

Componente para gestionar etiquetas personalizadas:
- Crear, editar y eliminar etiquetas
- Seleccionar etiquetas para tareas
- Selector de colores

### RecurringTaskOptions.js

Opciones para tareas recurrentes:
- Configuración de frecuencia (diaria, semanal, mensual)
- Fecha de finalización
- Gestión de subtareas

### TaskImagePicker.js

Componente para añadir imágenes a las tareas:
- Selección de archivos de imagen
- Vista previa de imagen
- Eliminar imagen

### SearchFilter.js

Componente para búsqueda y filtrado:
- Barra de búsqueda por texto
- Filtros por categoría, prioridad, estado
- Filtros por etiquetas

### UserAvatar.js

Componente para el avatar de usuario:
- Subir imagen de perfil
- Vista previa y edición

## 4. Configuración PWA

### Crear manifest.json

Crea un archivo `public/manifest.json`:

```json
{
  "name": "Agenda Semanal",
  "short_name": "Agenda",
  "description": "Aplicación de agenda semanal con recordatorios, categorías y prioridades",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "theme_color_dark": "#1f2937",
  "background_color_dark": "#111827",
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Crear Service Worker

Crea un archivo `src/service-worker.js`:

```javascript
const CACHE_NAME = 'agenda-semanal-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estrategia de caché: Cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Actualización del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Registro del Service Worker

Modifica el archivo `public/index.html` para añadir:

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration.scope);
        })
        .catch((error) => {
          console.log('Error al registrar el Service Worker:', error);
        });
    });
  }
</script>
```

## 5. Estilización con Tailwind CSS

La aplicación ya está estilizada con Tailwind CSS en todos los componentes. Algunos aspectos importantes:

- La aplicación utiliza `darkMode: 'class'` para alternar entre modos claro y oscuro
- Se ha implementado un diseño responsive que funciona en móviles y escritorio
- Los colores utilizan la paleta de colores de Tailwind

## 6. Despliegue

### Construir para producción

```bash
npm run build
# o
yarn build
```

### Desplegar en GitHub Pages

1. Instala el paquete `gh-pages`:

```bash
npm install --save-dev gh-pages
```

2. Añade estas líneas a tu `package.json`:

```json
{
  "homepage": "https://mazingerz969.github.io/agenda-semanal",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Despliega en GitHub Pages:

```bash
npm run deploy
```

### Otras opciones de despliegue

También puedes desplegar en:
- Netlify
- Vercel
- Firebase Hosting
- Cualquier otro servicio de hosting estático

## 7. Resolución de problemas comunes

### Problemas con el Service Worker

Si el Service Worker no funciona correctamente:
- Asegúrate de que el archivo `service-worker.js` está en la ubicación correcta
- Verifica que está registrado correctamente en `index.html`
- En desarrollo, puedes desactivar el Service Worker desde las herramientas de desarrollo del navegador

### Problemas con los íconos

Si los íconos no cargan:
- Asegúrate de que existen en la carpeta `public/icons/`
- Verifica que las rutas en `manifest.json` son correctas

### Problemas con localStorage

Si los datos no se guardan correctamente:
- Verifica que tienes permisos para almacenamiento en el navegador
- Limpia el localStorage del navegador e intenta de nuevo

### Problemas con CSS

Si el estilo no se aplica correctamente:
- Asegúrate de que TailwindCSS está configurado correctamente
- Verifica que `index.css` tiene las directivas correctas

---

¡Listo! Con esta guía deberías poder implementar completamente la aplicación Agenda Semanal paso a paso. Si tienes alguna duda o problema durante la implementación, revisa el código completo en la conversación o consulta la documentación oficial de las tecnologías utilizadas.
