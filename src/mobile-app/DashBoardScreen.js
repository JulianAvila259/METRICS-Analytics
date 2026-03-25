import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Partidos');

  console.log('DashboardScreen rendered'); // Para debug

  const partidos = [
    { id: 1, equipo: 'Futbol Club Magma', fecha: '22 abril 2024', torneo: 'Torneo Regional', stats: '31 km/h · 9.3 km · 14.5 km' },
    { id: 2, equipo: 'CD Nova Force', fecha: '18 abril 2024', torneo: 'Liga Metropolitana', stats: '29 km/h · 8.7 km · 13.8 km' },
    { id: 3, equipo: 'Atlético Vortex', fecha: '10 abril 2024', torneo: 'Copa de la Ciudad', stats: '30 km/h · 8.9 km · 12.9 km' },
  ];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'Inicio') {
      // Navegar a Home
    } else if (tab === 'Partidos') {
      // Ya estamos en Partidos
    } else if (tab === 'Perfil') {
      // Navegar a Perfil
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", onPress: () => {} },
        { 
          text: "Cerrar Sesión", 
          onPress: () => navigation.navigate('Login'),
          style: 'destructive'
        }
      ]
    );
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

      <ScrollView style={styles.list}>
        {partidos.map((partido) => (
          <View key={partido.id} style={styles.card}>
            <Text style={styles.cardTitle}>{partido.equipo}</Text>
            <Text style={styles.cardSub}>{partido.fecha} · {partido.torneo}</Text>
            <Text style={styles.cardStats}>{partido.stats}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.uploadButton} onPress={() => Alert.alert("Subir Partido", "Abre la cámara para grabar un partido")}>
          <Text style={styles.uploadText}>Sube tu primer partido</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tab Bar Con Navegación */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => handleTabPress('Inicio')} style={styles.tabItemContainer}>
          <Text style={[styles.tabItem, activeTab === 'Inicio' && styles.activeTab]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Partidos')} style={styles.tabItemContainer}>
          <Text style={[styles.tabItem, activeTab === 'Partidos' && styles.activeTab]}>Partidos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Perfil')} style={styles.tabItemContainer}>
          <Text style={[styles.tabItem, activeTab === 'Perfil' && styles.activeTab]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17', paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30, position: 'relative' },
  logoutButton: { position: 'absolute', right: 0, top: -10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#1F1F2E', borderRadius: 8 },
  logoutText: { color: '#FF4455', fontSize: 12, fontWeight: '600' },
  brand: { fontSize: 32, fontWeight: 'bold', color: '#00D1FF', letterSpacing: 2 },
  subtitle: { color: '#888', fontSize: 14 },
  searchBar: { backgroundColor: '#161B22', borderRadius: 25, padding: 15, color: '#fff', marginBottom: 30, borderWeight: 1, borderColor: '#30363D' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#161B22', borderRadius: 15, padding: 20, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#00D1FF' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: '#888', fontSize: 12, marginVertical: 5 },
  cardStats: { color: '#00D1FF', fontSize: 14, fontWeight: '600' },
  uploadButton: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#30363D', borderRadius: 15, padding: 30, alignItems: 'center', marginTop: 10 },
  uploadText: { color: '#00D1FF', fontSize: 14 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#161B22' },
  tabItemContainer: { flex: 1, alignItems: 'center', paddingVertical: 5 },
  tabItem: { color: '#888', fontSize: 12 },
  activeTab: { color: '#00D1FF' }
});