import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import BottomNav from '../components/BottomNav';

export default function DashboardScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const goToResultados = (partido) => {
    navigation.navigate('Resultados', { partido });
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') {
      return;
    }

    const match = filteredPartidos[0];
    if (match) {
      goToResultados(match);
    } else {
      Alert.alert('No encontrado', 'No se encontró ningún partido para esa búsqueda.');
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

        <TouchableOpacity style={styles.uploadButton} onPress={() => Alert.alert('Subir Partido', 'Abre la cámara para grabar un partido')}>
          <Text style={styles.uploadText}>Sube tu video</Text>
        </TouchableOpacity>
      </ScrollView>

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
});
