# Vortex Sports AI - Build & Distribution Guide

## 📱 Requisitos para Build

### 1. **Cuenta de Expo/EAS**
- Registrarse en [Expo.dev](https://expo.dev)
- Instalar EAS CLI: `npm install -g @expo/eas-cli`
- Login: `eas login`

### 2. **Configuración de Assets**
Crear los siguientes archivos en `assets/`:
- `icon.png` (1024x1024px) - Icono de la app
- `splash.png` (1242x2436px) - Pantalla de carga
- `adaptive-icon.png` (1024x1024px) - Icono adaptativo Android
- `favicon.png` (48x48px) - Favicon web

### 3. **Configuración de Build**

#### Android:
```bash
# Configurar keystore (primera vez)
eas build:configure

# Build de desarrollo
eas build --platform android --profile development

# Build de producción
eas build --platform android --profile production
```

#### iOS:
```bash
# Build de desarrollo
eas build --platform ios --profile development

# Build de producción
eas build --platform ios --profile production
```

## 🚀 Perfiles de Build (eas.json)

Crear `eas.json` en la raíz del proyecto:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    },
    "production": {
      "channel": "production",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 📦 Distribución

### Google Play Store
1. **Preparar Build**: `eas build --platform android --profile production`
2. **Descargar APK/AAB** desde Expo.dev
3. **Crear cuenta de desarrollador** en Google Play Console ($25)
4. **Subir app** y completar información
5. **Configurar precios y distribución**
6. **Publicar**

### App Store (iOS)
1. **Cuenta de Desarrollador Apple** ($99/año)
2. **Preparar Build**: `eas build --platform ios --profile production`
3. **Configurar certificados** en Apple Developer
4. **Subir a App Store Connect**
5. **Completar metadatos y screenshots**
6. **Enviar a revisión**

## 🔧 Configuración Adicional

### Variables de Entorno
Crear `.env` para configuración:
```
API_URL=https://api.vortexsports.com
ANALYTICS_KEY=your_analytics_key
```

### Push Notifications (opcional)
```bash
npx expo install expo-notifications
```

### Analytics (opcional)
```bash
npx expo install @expo-google-analytics
```

## 📋 Checklist Pre-Build

- [ ] `app.json` configurado correctamente
- [ ] Assets creados (iconos, splash)
- [ ] EAS CLI instalado y login hecho
- [ ] `eas.json` creado
- [ ] App probada en desarrollo
- [ ] Permisos configurados
- [ ] Bundle identifier único
- [ ] Versionado correcto

## 🏪 Publicación

### Beta Testing
- **Internal Testing** (Android): Compartir APK con testers
- **TestFlight** (iOS): Distribuir builds de prueba

### Producción
- **Google Play**: Proceso de 1-3 días
- **App Store**: Proceso de 1-7 días

## 💰 Costos

- **Expo/EAS**: Gratuito para builds básicos
- **Google Play**: $25 (una vez)
- **Apple Developer**: $99/año
- **Servidor**: Según uso

## 🔍 Troubleshooting

### Build falla
- Verificar `app.json` syntax
- Revisar logs de build en Expo.dev
- Verificar assets existen

### App no funciona en dispositivo
- Probar con build de desarrollo primero
- Verificar permisos
- Revisar logs del dispositivo

### Problemas de distribución
- Verificar bundle ID único
- Completar toda la información requerida
- Seguir guías específicas de cada store