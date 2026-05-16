import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../../context/AppDataContext';
import { showMessage } from '../../services/notify';

const initialForm = {
  nombre: '',
  apellido: '',
  edad: '',
  correo: '',
  usuario: '',
  password: '',
};

export default function RegisterScreen({ navigation }) {
  const { register } = useAppData();
  const [form, setForm] = useState(initialForm);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleRegister = async () => {

    const requiredFields = Object.entries(form).filter(([, value]) => !String(value).trim());

    if (requiredFields.length > 0) {
      Alert.alert('Formulario incompleto', 'Debes diligenciar todos los campos del registro.');
      return;
    }

    const result = await register(form);

    if (!result.ok) {
      Alert.alert('No fue posible registrar el usuario', result.message);
      return;
    }

    showMessage(
      'Usuario creado con éxito',
      'El usuario fue registrado exitosamente.',
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registrar usuario</Text>
        <Text style={styles.subtitle}>Crea tu cuenta para guardar tus partidos y resultados.</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#888"
            value={form.nombre}
            onChangeText={(value) => updateField('nombre', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#888"
            value={form.apellido}
            onChangeText={(value) => updateField('apellido', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={form.edad}
            onChangeText={(value) => updateField('edad', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#888"
            value={form.correo}
            onChangeText={(value) => updateField('correo', value)}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#888"
            value={form.usuario}
            onChangeText={(value) => updateField('usuario', value)}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            value={form.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryText}>Guardar usuario</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryText}>Volver al inicio de sesión</Text>
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
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 18,
  },
  subtitle: {
    color: '#8A94A6',
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 20,
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
  primaryButton: {
    backgroundColor: '#00D1FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: {
    color: '#000',
    fontWeight: '700',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D1FF',
    marginTop: 12,
  },
  secondaryText: {
    color: '#00D1FF',
    fontWeight: '600',
  },
});
