import React, { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { showMessage } from '../utils/notify';

const initialForm = {
  nombrePartido: '',
  fecha: '',
  torneo: '',
};

const openBrowserFilePicker = () =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (event) => {
      const file = event.target.files?.[0] || null;
      resolve(file);
    };
    input.click();
  });

export default function UploadMatchScreen({ navigation }) {
  const { addMatchForCurrentUser } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSelectVideo = async () => {
    if (Platform.OS === 'web') {
      const file = await openBrowserFilePicker();
      if (file) {
        setSelectedVideo(file);
      }
      return;
    }

    setSelectedVideo({
      name: 'video-ejemplo.mov',
      size: 180000000,
    });

    Alert.alert(
      'Video simulado',
      'En esta versión local se deja un video de ejemplo para dispositivos móviles. En web sí puedes seleccionar un archivo real.'
    );
  };

  const handleSaveMatch = () => {
    const requiredFields = Object.entries(form).filter(([, value]) => !String(value).trim());

    if (requiredFields.length > 0) {
      Alert.alert('Formulario incompleto', 'Debes ingresar nombre del partido, fecha y tipo de competencia.');
      return;
    }

    if (!selectedVideo) {
      Alert.alert('Video requerido', 'Debes seleccionar un video antes de guardar el partido.');
      return;
    }

    const result = addMatchForCurrentUser({
      ...form,
      video: selectedVideo,
    });

    if (!result.ok) {
      Alert.alert('No fue posible guardar el partido', result.message);
      return;
    }

    showMessage(
      'Partido creado con éxito',
      'El partido fue guardado correctamente y sus métricas se generaron de forma aleatoria.',
      () => navigation.replace('PartidoDetalle', { matchId: result.match.id })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Subir partido</Text>
        <Text style={styles.description}>
          Completa los datos del partido, selecciona el video y guarda el registro. Las métricas del jugador se generarán de forma aleatoria.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del partido"
          placeholderTextColor="#888"
          value={form.nombrePartido}
          onChangeText={(value) => updateField('nombrePartido', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha en que se jugó"
          placeholderTextColor="#888"
          value={form.fecha}
          onChangeText={(value) => updateField('fecha', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Competencia (Torneo Regional, Copa de la Ciudad, etc.)"
          placeholderTextColor="#888"
          value={form.torneo}
          onChangeText={(value) => updateField('torneo', value)}
        />

        <TouchableOpacity style={styles.videoButton} onPress={handleSelectVideo}>
          <Text style={styles.videoButtonText}>
            {selectedVideo ? 'Cambiar video' : 'Subir video'}
          </Text>
        </TouchableOpacity>

        <View style={styles.fileInfoBox}>
          <Text style={styles.fileInfoLabel}>Archivo seleccionado</Text>
          <Text style={styles.fileInfoValue}>
            {selectedVideo ? selectedVideo.name : 'Todavía no has seleccionado un video'}
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMatch}>
          <Text style={styles.saveButtonText}>Guardar partido</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  back: {
    color: '#AFC2DD',
    fontSize: 18,
    marginBottom: 18,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    color: '#9DB2C8',
    lineHeight: 22,
    marginBottom: 22,
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
  videoButton: {
    backgroundColor: '#18293A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  videoButtonText: {
    color: '#00D1FF',
    fontWeight: '700',
  },
  fileInfoBox: {
    borderWidth: 1,
    borderColor: '#1B2A3A',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    backgroundColor: '#0E1624',
  },
  fileInfoLabel: {
    color: '#8A94A6',
    fontSize: 12,
    marginBottom: 6,
  },
  fileInfoValue: {
    color: '#fff',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#00D1FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '700',
  },
});
