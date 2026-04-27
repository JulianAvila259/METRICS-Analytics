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

const metricCards = [
  { key: 'velocidadMaxima', label: 'Velocidad', suffix: 'km/h', icon: '⚡' },
  { key: 'distancia', label: 'Distancia', suffix: 'km', icon: '📍' },
  { key: 'sprints', label: 'Sprints', suffix: '', icon: '🏃' },
  { key: 'goles', label: 'Goles', suffix: '', icon: '⚽' },
  { key: 'pases', label: 'Pases', suffix: '', icon: '🎯' },
  { key: 'rendimiento', label: 'Rendimiento', suffix: '', icon: '📊' },
];

export default function ResultadosScreen({ navigation }) {
  const { currentUser, getMatchesForCurrentUser } = useAppData();
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      const matches = await getMatchesForCurrentUser();
      setPartidos(matches);
      setLoading(false);
    };
    loadMatches();
  }, [getMatchesForCurrentUser]);

  const partido = partidos?.[0] || null;
  const stats = partido ? partido.stats || partido : null;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.contentOnly}>
          <Text style={styles.emptyTitle}>Cargando...</Text>
        </View>
        <BottomNav activeRoute="Resultados" navigation={navigation} />
      </View>
    );
  }

  if (!partido) {
    return (
      <View style={styles.container}>
        <View style={styles.contentOnly}>
          <Text style={styles.backText}>Resultados</Text>
          <Text style={styles.emptyTitle}>Todavía no tienes resultados</Text>
          <Text style={styles.emptyText}>
            Carga un partido desde la sección Partidos para generar métricas y visualizar este resumen.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('UploadMatch')}>
            <Text style={styles.primaryButtonText}>Subir partido</Text>
          </TouchableOpacity>
        </View>
        <BottomNav activeRoute="Resultados" navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.backText}>← Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Paquete</Text>
        <Text style={styles.heading}>Métricas del jugador descargadas</Text>
        <Text style={styles.description}>
          A continuación, los resultados detallados de {currentUser.nombre} {currentUser.apellido}.
        </Text>

        <TouchableOpacity
          style={styles.playerCard}
          onPress={() => navigation.navigate('PartidoDetalle', { matchId: partido.id })}
        >
          <View style={styles.avatar} />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{currentUser.nombre} {currentUser.apellido}</Text>
            <Text style={styles.playerSub}>Jugador · {stats?.minutos} min</Text>
            <Text style={styles.playerStats}>
              {stats?.velocidadMaxima} km/h · {stats?.distancia} km · {stats?.goles} ⚽ · {stats?.sprints}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.radarCard}>
          <Text style={styles.radarTitle}>Resumen del último partido</Text>
          <View style={styles.radarGrid}>
            {metricCards.map((metric) => (
              <View key={metric.key} style={styles.metricBox}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricValue}>
                  {stats?.[metric.key]}{metric.suffix ? ` ${metric.suffix}` : ''}
                </Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => navigation.navigate('PartidoDetalle', { matchId: partido.id })}
        >
          <Text style={styles.downloadText}>Ver detalle y descargar paquete</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav activeRoute="Resultados" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B1D',
  },
  contentOnly: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backText: {
    color: '#AFC2DD',
    fontSize: 18,
    marginBottom: 14,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    color: '#B9C2D0',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 18,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00AFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(13, 31, 56, 0.7)',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#173F7A',
    marginRight: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  playerSub: {
    color: '#9DB2C8',
    fontSize: 15,
    marginTop: 4,
  },
  playerStats: {
    color: '#39C5FF',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
  },
  radarCard: {
    backgroundColor: 'rgba(12, 20, 39, 0.9)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#12355C',
  },
  radarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  radarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricBox: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: '#091325',
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#17385C',
  },
  metricIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  metricValue: {
    color: '#00CFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  metricLabel: {
    color: '#9DB2C8',
    fontSize: 13,
    marginTop: 8,
  },
  downloadButton: {
    marginTop: 18,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#00CFFF',
    paddingVertical: 16,
    alignItems: 'center',
  },
  downloadText: {
    color: '#00CFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    color: '#9DB2C8',
    lineHeight: 22,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: '#00D1FF',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '700',
  },
});
