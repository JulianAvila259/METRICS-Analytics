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
import { useAppData } from '../context/AppDataContext';

export default function LoginScreen({ navigation, route }) {
  const { login } = useAppData();
  const [usuario, setUsuario] = useState(route?.params?.prefilledUsername || 'juang10');
  const [password, setPassword] = useState('123456');

  const handleLogin = () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa usuario y contraseña.');
      return;
    }

    const result = login(usuario, password);

    if (!result.ok) {
      Alert.alert('No fue posible iniciar sesión', result.message);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>VORTEX</Text>
        <Text style={styles.subtitle}>Sports AI</Text>
        <Text style={styles.heading}>Tu rendimiento profesional, hoy.</Text>
        <Text style={styles.description}>
          Inicia sesión con tu usuario y contraseña o crea una cuenta nueva para cargar tus partidos.
        </Text>

        <Image
          source={require('../data/jugador.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.form}>
          <TextInput
            placeholder="Usuario"
            placeholderTextColor="#888"
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
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

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Usuario de prueba</Text>
          <Text style={styles.demoText}>usuario: juang10</Text>
          <Text style={styles.demoText}>contraseña: 123456</Text>
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
  },
  demoBox: {
    width: '100%',
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: '#111827',
    padding: 18,
    borderWidth: 1,
    borderColor: '#1B2532',
  },
  demoTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  demoText: {
    color: '#9DB2C8',
    marginBottom: 4,
  },
});
