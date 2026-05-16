import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../../context/AppDataContext';

export default function LoginScreen({ navigation, route }) {
  const { login } = useAppData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('[LoginScreen.handleLogin] Starting login with email:', email);
    
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa correo y contraseña validos.');
      return;
    }

    console.log('[LoginScreen.handleLogin] Calling context.login()...');
    const result = await login(email, password);
    console.log('[LoginScreen.handleLogin] Login result:', result);

    if (!result.ok) {
      Alert.alert('No fue posible iniciar sesión', result.message);
      return;
    }

    console.log('[LoginScreen.handleLogin] Login successful, navigating to Dashboard');
    
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>VORTEX</Text>
        <Text style={styles.subtitle}>Sports AI</Text>
        <Text style={styles.heading}>Tu rendimiento profesional, hoy.</Text>
        <Text style={styles.description}>
          Inicia sesión con tu correo y contraseña o crea una cuenta nueva para cargar tus partidos.
        </Text>

        <Image
          source={require('../../assets/jugador.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.form}>
          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#888"
            style={styles.input}
            returnKeyType="next"
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.secondaryText}>Registrar usuario</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#00D1FF',
    marginTop: 20,
  },
  subtitle: {
    color: '#888',
    marginBottom: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  description: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 310,
    marginVertical: 10,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#161B22',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#202833',
  },
  loginButton: {
    backgroundColor: '#00D1FF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#000',
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#00D1FF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryText: {
    color: '#00D1FF',
    fontWeight: '600',
  }
});
