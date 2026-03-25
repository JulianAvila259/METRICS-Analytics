import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import BottomNav from '../components/BottomNav';

export default function DashboardScreen({ navigation }) {
  const partidos = [
    { id: 1, equipo: 'Futbol Club Magma', fecha: '22 abril 2024', torneo: 'Torneo Regional', stats: '31 km/h · 9.3 km · 14.5 km' },
    { id: 2, equipo: 'CD Nova Force', fecha: '18 abril 2024', torneo: 'Liga Metropolitana', stats: '29 km/h · 8.7 km · 13.8 km' },
    { id: 3, equipo: 'Atlético Vortex', fecha: '10 abril 2024', torneo: 'Copa de la Ciudad', stats: '30 km/h · 8.9 km · 12.9 km' },
  ];

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
      />

      <Text style={styles.sectionTitle}>Partidos recientes</Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {partidos.map((partido) => (
          <View key={partido.id} style={styles.card}>
            <Text style={styles.cardTitle}>{partido.equipo}</Text>
            <Text style={styles.cardSub}>{partido.fecha} · {partido.torneo}</Text>
            <Text style={styles.cardStats}>{partido.stats}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.uploadButton} onPress={() => Alert.alert('Subir Partido', 'Abre la cámara para grabar un partido')}>
          <Text style={styles.uploadText}>Sube tu primer partido</Text>
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
});
