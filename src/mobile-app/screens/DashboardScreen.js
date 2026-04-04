import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import BottomNav from '../components/BottomNav';

export default function DashboardScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const goToResultados = (partido) => {
    console.log('goToResultados called with:', partido);
    navigation.navigate('Resultados', { partido });
  };

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a la cámara y galería para subir videos.');
      return false;
    }
    return true;
  };

  const pickVideoFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 300, // 5 minutos máximo
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0]);
    }
  };

  const recordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 300,
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0]);
    }
  };

  const showVideoOptions = () => {
    if (selectedVideo) {
      Alert.alert(
        'Video ya seleccionado',
        '¿Qué quieres hacer?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cambiar video', onPress: () => {
            Alert.alert(
              'Nuevo video',
              '¿Cómo quieres obtener el video?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Grabar video', onPress: recordVideo },
                { text: 'Seleccionar de galería', onPress: pickVideoFromGallery },
              ]
            );
          }},
          { text: 'Analizar video', onPress: analyzeVideo, style: 'default' },
        ]
      );
    } else {
      Alert.alert(
        'Subir Video',
        '¿Cómo quieres obtener el video?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Grabar video', onPress: recordVideo },
          { text: 'Seleccionar de galería', onPress: pickVideoFromGallery },
        ]
      );
    }
  };

  const analyzeVideo = async () => {
    if (!selectedVideo) return;

    setAnalyzing(true);
    
    // Simular análisis del video (en producción esto sería una llamada a API)
    setTimeout(() => {
      setAnalyzing(false);
      setSelectedVideo(null);
      
      // Crear datos simulados del análisis
      const analyzedMatch = {
        id: Date.now(),
        equipo: 'Partido Analizado',
        fecha: new Date().toLocaleDateString('es-ES'),
        torneo: 'Análisis IA',
        stats: '32 km/h · 9.8 km · 15.2 km',
        velocidad: '32 km/h',
        distancia: '9.8 km',
        goles: 2,
        tiros: 12,
        pases: 28,
        sprints: 25,
        vision: '76',
        precision: '72',
        rendimiento: '89',
        asistencias: 1,
        videoUri: selectedVideo.uri,
      };

      // Navegar a resultados con los datos analizados
      navigation.navigate('Resultados', { partido: analyzedMatch });
      
      Alert.alert('Análisis completado', 'El video ha sido analizado exitosamente.');
    }, 3000); // 3 segundos de simulación
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') {
      Alert.alert('Búsqueda vacía', 'Por favor ingresa un término de búsqueda.');
      return;
    }

    if (filteredPartidos.length === 0) {
      Alert.alert('No encontrado', 'No se encontró ningún partido que coincida con tu búsqueda.');
    } else if (filteredPartidos.length === 1) {
      goToResultados(filteredPartidos[0]);
    } else {
      // Si hay múltiples resultados, mostrar el primero
      goToResultados(filteredPartidos[0]);
    }
  };

  const partidos = [
    {
      id: 1,
      equipo: 'Futbol Club Magma',
      fecha: '22 abril 2024',
      torneo: 'Torneo Regional',
      stats: '31 km/h · 9.3 km · 14.5 km',
      velocidad: '31 km/h',
      distancia: '9.3 km',
      goles: 2,
      tiros: 10,
      pases: 24,
      sprints: 21,
      vision: '72',
      precision: '68',
      rendimiento: '85',
      asistencias: 2,
    },
    {
      id: 2,
      equipo: 'CD Nova Force',
      fecha: '18 abril 2024',
      torneo: 'Liga Metropolitana',
      stats: '29 km/h · 8.7 km · 13.8 km',
      velocidad: '29 km/h',
      distancia: '8.7 km',
      goles: 1,
      tiros: 8,
      pases: 18,
      sprints: 17,
      vision: '70',
      precision: '63',
      rendimiento: '78',
      asistencias: 1,
    },
    {
      id: 3,
      equipo: 'Atlético Vortex',
      fecha: '10 abril 2024',
      torneo: 'Copa de la Ciudad',
      stats: '30 km/h · 8.9 km · 12.9 km',
      velocidad: '30 km/h',
      distancia: '8.9 km',
      goles: 3,
      tiros: 14,
      pases: 22,
      sprints: 20,
      vision: '75',
      precision: '71',
      rendimiento: '88',
      asistencias: 3,
    },
  ];

  const filteredPartidos = partidos.filter((partido) => {
    const query = searchQuery.toLowerCase();
    if (query === '') return true;
    return (
      partido.equipo.toLowerCase().includes(query) ||
      partido.fecha.toLowerCase().includes(query) ||
      partido.torneo.toLowerCase().includes(query)
    );
  });

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>VORTEX</Text>
        <Text style={styles.subtitle}>Sports AI</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Torneo, fecha, equipo"
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
      />

      <Text style={styles.sectionTitle}>Partidos recientes</Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredPartidos.length > 0 ? (
          filteredPartidos.map((partido) => (
            <TouchableOpacity
              key={partido.id}
              style={styles.card}
              onPress={() => goToResultados(partido)}
            >
              <Text style={styles.cardTitle}>{partido.equipo}</Text>
              <Text style={styles.cardSub}>{partido.fecha} · {partido.torneo}</Text>
              <Text style={styles.cardStats}>{partido.stats}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No se encontraron partidos.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.uploadButton} onPress={showVideoOptions}>
          <Text style={styles.uploadText}>
            {selectedVideo ? 'Video seleccionado ✓' : 'Sube tu video'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para video seleccionado */}
      <Modal visible={!!selectedVideo} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Video seleccionado</Text>
            
            <Video
              source={{ uri: selectedVideo?.uri }}
              style={styles.videoPreview}
              useNativeControls
              resizeMode="contain"
              isLooping={false}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setSelectedVideo(null)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.analyzeButton]} 
                onPress={analyzeVideo}
                disabled={analyzing}
              >
                {analyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.analyzeButtonText}>Analizar Video</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav navigation={navigation} activeTab="Dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    top: -10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1F1F2E',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FF4455',
    fontSize: 12,
    fontWeight: '600',
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00D1FF',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
  },
  searchBar: {
    backgroundColor: '#161B22',
    borderRadius: 25,
    padding: 15,
    color: '#fff',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#161B22',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#00D1FF',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSub: {
    color: '#888',
    fontSize: 12,
    marginVertical: 5,
  },
  cardStats: {
    color: '#00D1FF',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadText: {
    color: '#00D1FF',
    fontSize: 14,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#888',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#161B22',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#30363D',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#00D1FF',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
