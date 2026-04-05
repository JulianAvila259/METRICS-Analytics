import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppData } from '../context/AppDataContext';

export default function PerfilScreen({ navigation }) {
  const { currentUser } = useAppData();

  const totalPartidos = currentUser?.partidos?.length || 0;
  const ultimoPartido = currentUser?.partidos?.[0] || null;

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>VORTEX</Text>
          <Text style={styles.subtitle}>Sports AI</Text>
        </View>

        <View style={styles.profileCard}>
          <Image source={require('../data/juang.png')} style={styles.avatar} />
          <Text style={styles.name}>{currentUser?.nombre} {currentUser?.apellido}</Text>
          <Text style={styles.email}>{currentUser?.correo}</Text>
          <Text style={styles.username}>@{currentUser?.usuario}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Edad</Text>
            <Text style={styles.value}>{currentUser?.edad} años</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Total de partidos</Text>
            <Text style={styles.value}>{totalPartidos}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Último partido</Text>
            <Text style={styles.value}>{ultimoPartido ? ultimoPartido.nombrePartido : 'Sin partidos cargados'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UploadMatch')}>
          <Text style={styles.buttonText}>Subir un nuevo partido</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav activeRoute="Perfil" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
  username: {
    color: '#00D1FF',
    marginTop: 8,
    fontWeight: '600',
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
  button: {
    marginTop: 30,
    backgroundColor: '#00D1FF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0A0E17',
    fontWeight: 'bold',
  },
});
