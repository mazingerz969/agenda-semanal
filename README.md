# Agenda Semanal

## Descripción

Agenda Semanal es una aplicación web desarrollada con React que te permite organizar tus tareas semanales de forma eficiente. Con una interfaz intuitiva y amigable, podrás gestionar tu tiempo y aumentar tu productividad.

## Características principales

- ✅ Organización de tareas por día de la semana
- 🌙 Soporte para modo oscuro
- 📱 Diseño responsivo para todos los dispositivos
- 🔄 Persistencia de datos mediante almacenamiento local
- 🏷️ Etiquetas personalizadas para categorizar tareas
- 🔍 Filtrado y búsqueda de tareas

## Demo

Puedes ver la aplicación en funcionamiento aquí: [https://mazingerz969.github.io/agenda-semanal/](https://mazingerz969.github.io/agenda-semanal/)

![Captura de pantalla de la aplicación](https://i.imgur.com/example.png) <!-- Reemplaza con una captura real de tu app -->

## Tecnologías utilizadas

- React
- Tailwind CSS
- LocalStorage API
- GitHub Pages

## Instalación local

Para ejecutar esta aplicación en tu entorno local:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/mazingerz969/agenda-semanal.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd agenda-semanal
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue

La aplicación está configurada para desplegarse en GitHub Pages. Para desplegar una nueva versión:

```bash
npm run build
npm run deploy
```

## Uso

1. **Añadir tarea**: Haz clic en el día deseado y completa el formulario
2. **Editar tarea**: Selecciona una tarea existente para modificarla
3. **Eliminar tarea**: Utiliza el botón de eliminar en cada tarea
4. **Cambiar tema**: Alterna entre modo claro y oscuro con el botón en la barra superior

## Estructura del proyecto

```
agenda-semanal/
├── public/          # Archivos estáticos y configuración PWA
├── src/
│   ├── components/  # Componentes React reutilizables
│   ├── hooks/       # Custom hooks
│   ├── context/     # Contextos de React
│   ├── App.js       # Componente principal
│   └── index.js     # Punto de entrada
└── package.json     # Dependencias y scripts
```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar esta aplicación:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`)
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue o contactarme directamente.

---

Desarrollado con ❤️ por [Mazingerz969](https://github.com/mazingerz969)
