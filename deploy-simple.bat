@echo off
echo Construyendo la aplicación...
set DISABLE_WORKBOX=true
set GENERATE_SOURCEMAP=false
call npm run build
echo Desplegando en GitHub Pages...
call npx gh-pages -d build
echo Despliegue completado!
