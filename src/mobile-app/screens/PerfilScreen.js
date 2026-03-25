import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

export default function PerfilScreen({ navigation }) {

  const user = {
    nombre: "Juan Gonzales",
    email: "fJuanG1@email.com",
    equipo: "Atlético Nacho",
    posicion: "Delantero",
    edad: 21
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.brand}>VORTEX</Text>
        <Text style={styles.subtitle}>Sports AI</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={require('../data/juang.png')}
          style={styles.avatar}
        />

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
    paddingHorizontal: 20,
    paddingTop: 60
  },

  header: {
    alignItems: 'center',
    marginBottom: 30
  },

  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00D1FF',
    letterSpacing: 2
  },

  subtitle: {
    color: '#888',
    fontSize: 14
  },

  profileCard: {
    alignItems: 'center',
    backgroundColor: '#161B22',
    borderRadius: 25,
    padding: 30,
    marginBottom: 25
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15
  },

  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  email: {
    color: '#888',
    fontSize: 14,
    marginTop: 5
  },

  infoContainer: {
    gap: 15
  },

  infoCard: {
    backgroundColor: '#161B22',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00D1FF'
  },

  label: {
    color: '#888',
    fontSize: 12
  },

  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5
  },

  button: {
    marginTop: 30,
    backgroundColor: '#00D1FF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center'
  },

  buttonText: {
    color: '#0A0E17',
    fontWeight: 'bold'
  }
});