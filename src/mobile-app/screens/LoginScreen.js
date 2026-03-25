import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';

export default function LoginScreen({ navigation }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const handleAuthSimulado = (metodo) => {
    
    if (metodo === 'Email' && (email === '' || password === '')) {
      Alert.alert("Campos vacíos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);

    
   setTimeout(() => {
    setIsLoading(false);
    
    // Navegar directamente al Dashboard sin Alert
    navigation.navigate('Dashboard');
  }, 1500);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>METRIX Analytics</Text>

      {}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      {}
      <TouchableOpacity 
        style={[styles.buttonMain, isLoading && { opacity: 0.7 }]} 
        onPress={() => handleAuthSimulado('Email')}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>o continúa con</Text>

      {}
      <View style={styles.socialContainer}>
        <TouchableOpacity 
          style={styles.buttonSocial} 
          onPress={() => handleAuthSimulado('Google')}
          disabled={isLoading}
        >
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSocial} 
          onPress={() => handleAuthSimulado('Apple')}
          disabled={isLoading}
        >
          <Text style={styles.socialText}>Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#ffffff' },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 40, color: '#1A1A1A' },
  input: { backgroundColor: '#F0F0F0', padding: 18, borderRadius: 12, marginBottom: 15, fontSize: 16, color: '#1A1A1A' },
  buttonMain: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  orText: { textAlign: 'center', marginVertical: 25, color: '#888', fontSize: 14 },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonSocial: { padding: 15, borderWidth: 1.5, borderColor: '#E5E5E5', borderRadius: 12, width: '48%', alignItems: 'center' },
  socialText: { fontWeight: '600', color: '#444' }
});