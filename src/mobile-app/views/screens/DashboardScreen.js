import React, { useMemo, useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppData } from '../../context/AppDataContext';
import { normalizeSearchText } from '../../utils/matchMetrics';

export default function DashboardScreen({ navigation }) {
  const { currentUser, logout, getMatchesForCurrentUser } = useAppData();
  const [search, setSearch] = useState('');
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadMatches = async () => {
      const matches = await getMatchesForCurrentUser();
      if (isActive) {
        setPartidos(matches);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadMatches);
    loadMatches();

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [getMatchesForCurrentUser, navigation]);

  const filteredMatches = useMemo(() => {
    const searchTerm = normalizeSearchText(search);

    if (!searchTerm) {
      return partidos;
    }

    return partidos.filter((partido) => {
      const stats = partido.stats || partido;
      const indicators = partido.indicators || {};
      const searchable = normalizeSearchText([
        partido.nombrePartido,
        partido.fecha,
        partido.torneo,
        partido.resumen,
        stats.velocidadMaxima,
        stats.distancia,
        stats.sprints,
        stats.goles,
        stats.tiros,
        stats.pases,
        stats.minutos,
        indicators.intensidadSprints,
        indicators.participacionOfensiva,
        indicators.eficaciaDefinicion,
        indicators.ritmoJuego,
      ].join(' '));
      return searchable.includes(searchTerm);
    });
  }, [partidos, search]);

  const handleLogout = async () => {
    await logout();
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

      <Text style={styles.welcome}>Hola, {currentUser?.usuario}. Estos son tus partidos cargados.</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por partido, fecha, torneo o métrica"
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.sectionTitle}>Partidos recientes</Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredMatches.map((partido) => (
          <TouchableOpacity
            key={partido.id}
            style={styles.card}
            onPress={() => navigation.navigate('PartidoDetalle', { matchId: partido.id })}
          >
            <Text style={styles.cardTitle}>{partido.nombrePartido}</Text>
            <Text style={styles.cardSub}>
              {partido.fecha} · {partido.torneo}
            </Text>
            <Text style={styles.cardStats}>{partido.resumen}</Text>
          </TouchableOpacity>
        ))}

        {filteredMatches.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No hay partidos para mostrar</Text>
            <Text style={styles.emptyText}>
              Registra un partido para generar métricas e indicadores.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate('UploadMatch')}
        >
          <Text style={styles.uploadText}>Registrar partido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resultsShortcut}
          onPress={() => {
            if (partidos.length === 0) {
              Alert.alert('Sin resultados', 'Primero debes guardar al menos un partido.');
              return;
            }
            navigation.navigate('Resultados');
          }}
        >
          <Text style={styles.resultsShortcutText}>Ver resultados del jugador</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav activeRoute="Dashboard" navigation={navigation} />
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
    marginBottom: 20,
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
  welcome: {
    color: '#9DB2C8',
    lineHeight: 20,
    marginBottom: 18,
  },
  searchBar: {
    backgroundColor: '#161B22',
    borderRadius: 25,
    padding: 15,
    color: '#fff',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
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
  emptyCard: {
    backgroundColor: '#121826',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#202833',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: '#8A94A6',
    lineHeight: 20,
  },
  uploadButton: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 15,
    padding: 22,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  uploadText: {
    color: '#00D1FF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsShortcut: {
    backgroundColor: '#0E1624',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1B2A3A',
  },
  resultsShortcutText: {
    color: '#9FE8FF',
    fontWeight: '600',
  },
});
