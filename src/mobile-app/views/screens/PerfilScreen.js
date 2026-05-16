import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppData } from '../../context/AppDataContext';

export default function PerfilScreen({ navigation }) {
  const { currentUser, getMatchesForCurrentUser, logout } = useAppData();
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      const matches = await getMatchesForCurrentUser();
      setPartidos(matches);
    };
    loadMatches();
  }, [getMatchesForCurrentUser]);

  const totalPartidos = partidos?.length || 0;
  const ultimoPartido = partidos?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
  const nombreCompleto = [currentUser?.nombre, currentUser?.apellido].filter(Boolean).join(' ') || 'Jugador';
  const iniciales = nombreCompleto.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.brand}>VORTEX</Text>
          <Text style={styles.brandSub}>Sports AI</Text>
        </View>

        {/* Avatar con iniciales */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciales}</Text>
          </View>
          <Text style={styles.name}>{nombreCompleto}</Text>
          <Text style={styles.email}>{currentUser?.email}</Text>
        </View>

        {/* Stats rápidas */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalPartidos}</Text>
            <Text style={styles.statLabel}>Partidos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser?.edad || '—'}</Text>
            <Text style={styles.statLabel}>Edad</Text>
          </View>
        </View>

        {/* Último partido */}
        {ultimoPartido && (
          <TouchableOpacity
            style={styles.lastMatchCard}
            onPress={() => navigation.navigate('PartidoDetalle', { matchId: ultimoPartido.id })}
          >
            <Text style={styles.lastMatchLabel}>Último partido</Text>
            <Text style={styles.lastMatchName}>{ultimoPartido.nombrePartido}</Text>
            <Text style={styles.lastMatchMeta}>{ultimoPartido.fecha} · {ultimoPartido.torneo}</Text>
            <Text style={styles.lastMatchLink}>Ver detalle →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('UploadMatch')}>
          <Text style={styles.primaryButtonText}>Registrar nuevo partido</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomNav activeRoute="Perfil" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0A0E17' },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 10, marginBottom: 24 },
  brand: { fontSize: 28, fontWeight: 'bold', color: '#00D1FF', letterSpacing: 2 },
  brandSub: { color: '#888', fontSize: 13 },
  profileCard: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#00D1FF', justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  name: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  email: { color: '#8A94A6', fontSize: 14 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#161B22',
    borderRadius: 16, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#202833',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#00D1FF' },
  statLabel: { color: '#8A94A6', fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#202833' },
  lastMatchCard: {
    backgroundColor: '#161B22', borderRadius: 16, padding: 18,
    marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#00D1FF',
    borderWidth: 1, borderColor: '#202833',
  },
  lastMatchLabel: { color: '#8A94A6', fontSize: 12, marginBottom: 6 },
  lastMatchName: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  lastMatchMeta: { color: '#8A94A6', fontSize: 13, marginBottom: 8 },
  lastMatchLink: { color: '#00D1FF', fontSize: 13, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#00D1FF', padding: 16,
    borderRadius: 12, alignItems: 'center', marginBottom: 12,
  },
  primaryButtonText: { color: '#000', fontWeight: '700' },
  logoutButton: {
    borderWidth: 1, borderColor: '#FF4455', padding: 16,
    borderRadius: 12, alignItems: 'center',
  },
  logoutText: { color: '#FF4455', fontWeight: '600' },
});