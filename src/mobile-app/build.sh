#!/bin/bash

echo "🚀 Vortex Sports AI - Build Script"
echo "=================================="

# Verificar si EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI no está instalado. Instala con: npm install -g @expo/eas-cli"
    exit 1
fi

# Verificar si está logueado
if ! eas whoami &> /dev/null; then
    echo "❌ No estás logueado en EAS. Ejecuta: eas login"
    exit 1
fi

echo "Selecciona plataforma:"
echo "1) Android"
echo "2) iOS"
echo "3) Ambas"
read -p "Opción: " platform

echo "Selecciona tipo de build:"
echo "1) Development"
echo "2) Production"
read -p "Opción: " build_type

case $platform in
    1)
        platform_flag="android"
        ;;
    2)
        platform_flag="ios"
        ;;
    3)
        platform_flag="all"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

case $build_type in
    1)
        profile="development"
        ;;
    2)
        profile="production"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo "🔨 Iniciando build..."
echo "Plataforma: $platform_flag"
echo "Perfil: $profile"
echo ""

if [ "$platform_flag" = "all" ]; then
    eas build --platform android --profile $profile
    eas build --platform ios --profile $profile
else
    eas build --platform $platform_flag --profile $profile
fi

echo "✅ Build completado. Revisa expo.dev para descargar."