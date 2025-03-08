Write-Host "Construyendo la aplicación..." -ForegroundColor Green
npm run build
Write-Host "Desplegando en GitHub Pages..." -ForegroundColor Green
npx gh-pages -d build
Write-Host "Despliegue completado!" -ForegroundColor Green 