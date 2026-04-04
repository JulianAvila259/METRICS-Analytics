import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

export default function PerfilScreen({ navigation }) {
  const user = {
    nombre: 'Juan Gonzales',
    email: 'fJuanG1@email.com',
    equipo: 'Colombianitos FC',
    posicion: 'Delantero',
    edad: 21,
  };

  const estadisticasAcumuladas = {
    partidosJugados: 3,
    golesTotales: 6, // 2 + 1 + 3
    asistencias: 6, // 2 + 1 + 3
    distanciaRecorrida: '26.9 km', // 9.3 + 8.7 + 8.9
    velocidadPromedio: '30 km/h', // promedio de 31, 29, 30
    sprintsTotales: 58, // 21 + 17 + 20
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>VORTEX</Text>
          <Text style={styles.subtitle}>Sports AI</Text>
        </View>

        <View style={styles.profileCard}>
          <Image source={require('../data/player.png')} style={styles.avatar} />
          <Text style={styles.name}>{user.nombre}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Equipo</Text>
            <Text style={styles.value}>{user.equipo}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Posición</Text>
            <Text style={styles.value}>{user.posicion}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Edad</Text>
            <Text style={styles.value}>{user.edad} años</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estadísticas Acumuladas</Text>
        <View style={styles.estadisticasGrid}>
          <View style={styles.estadisticaCard}>
            <Text style={styles.estadisticaValue}>{estadisticasAcumuladas.partidosJugados}</Text>
            <Text style={styles.estadisticaLabel}>Partidos Jugados</Text>
          </View>
          <View style={styles.estadisticaCard}>
            <Text style={styles.estadisticaValue}>{estadisticasAcumuladas.golesTotales}</Text>
            <Text style={styles.estadisticaLabel}>Goles Totales</Text>
          </View>
          <View style={styles.estadisticaCard}>
            <Text style={styles.estadisticaValue}>{estadisticasAcumuladas.asistencias}</Text>
            <Text style={styles.estadisticaLabel}>Asistencias</Text>
          </View>
          <View style={styles.estadisticaCard}>
            <Text style={styles.estadisticaValue}>{estadisticasAcumuladas.distanciaRecorrida}</Text>
            <Text style={styles.estadisticaLabel}>Distancia Recorrida</Text>
          </View>
          <View style={styles.estadisticaCard}>
            <Text style={styles.estadisticaValue}>{estadisticasAcumuladas.velocidadPromedio}</Text>
            <Text style={styles.estadisticaLabel}>Velocidad Promedio</Text>
          </View>
          <View style={styles.estadisticaCard}>
            <Text style={styles.estadisticaValue}>{estadisticasAcumuladas.sprintsTotales}</Text>
            <Text style={styles.estadisticaLabel}>Sprints Totales</Text>
          </View>
        </View>

      </ScrollView>

      <BottomNav navigation={navigation} activeTab="Perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00D1FF',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#161B22',
    borderRadius: 25,
    padding: 30,
    marginBottom: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  infoContainer: {
    gap: 15,
  },
  infoCard: {
    backgroundColor: '#161B22',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00D1FF',
  },
  label: {
    color: '#888',
    fontSize: 12,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },
  estadisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  estadisticaCard: {
    width: '48%',
    backgroundColor: '#161B22',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#00D1FF',
  },
  estadisticaValue: {
    color: '#39C8FF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  estadisticaLabel: {
    color: '#B7C6E0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});
