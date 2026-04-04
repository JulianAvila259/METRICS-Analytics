# 🚀 Primer Build de Vortex Sports AI

## Paso 1: Instalar dependencias
```bash
npm install -g @expo/eas-cli
eas login
```

## Paso 2: Configurar assets
Crear en `assets/`:
- icon.png (1024x1024)
- splash.png (1242x2436)
- adaptive-icon.png (1024x1024)

## Paso 3: Build de desarrollo
```bash
# Android
eas build --platform android --profile development

# iOS
eas build --platform ios --profile development
```

## Paso 4: Instalar en dispositivo
1. Descargar APK/APP desde expo.dev
2. Instalar en dispositivo
3. Probar funcionalidades

## Paso 5: Build de producción (cuando esté listo)
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

## 📋 Checklist rápido
- [ ] EAS CLI instalado
- [ ] Login en EAS
- [ ] Assets creados
- [ ] app.json configurado
- [ ] Primera build exitosa
- [ ] App probada en dispositivo