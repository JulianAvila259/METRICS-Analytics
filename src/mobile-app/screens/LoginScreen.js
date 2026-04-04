import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogin = () => {
    navigation.navigate('Dashboard');
  };

  const handleForgotPassword = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      navigation.navigate('ForgotPassword');
      // Reset after a short delay to allow re-press if needed
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Vortex</Text>
        <Text style={styles.subtitle}>Sports AI</Text>
        <Text style={styles.heading}>
          Tu rendimiento profesional a la mano.
        </Text>
        <Image
          source={require('../data/player.png')}
          style={styles.image}
          height={220}
          resizeMode="contain"
          onError={() => console.log('Error loading player.png')}
        />
        <View style={styles.form}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
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
          <TouchableOpacity onPress={handleForgotPassword} disabled={isNavigating}>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  description: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  image: {
    width: '100%',
    height: 350,
    marginVertical: 20,
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
  },

  forgot: {
    color: '#00D1FF',
    textAlign: 'right',
    marginBottom: 15,
  },

  loginButton: {
    backgroundColor: '#00D1FF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  loginText: {
    color: '#000',
    fontWeight: 'bold',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },

  or: {
    color: '#888',
    marginHorizontal: 10,
  },

  socialButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  socialText: {
    color: '#fff',
  },
});