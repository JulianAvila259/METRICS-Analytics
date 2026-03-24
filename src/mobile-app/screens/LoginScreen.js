import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brand}>METRICS</Text>
        <Text style={styles.tagline}>Mide tu juego. Supera tus límites.</Text>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Tu rendimiento profesional, hoy.</Text>
          <Text style={styles.description}>
            Transforma tus datos en decisiones inteligentes y lleva tu juego al siguiente nivel.
          </Text>
        </View>

        {/* Botones de Redes Sociales */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>Continuar con Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050A0E', 
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    color: '#4FD1C5', 
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  tagline: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 60,
  },
  headerTextContainer: {
    width: '100%',
    marginBottom: 100,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: '#CBD5E0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  socialButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2D3748',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});