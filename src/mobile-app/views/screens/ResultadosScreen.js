import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppData } from '../../context/AppDataContext';
import { formatNumber, normalizeSearchText, calculateMatchIndicators } from '../../utils/matchMetrics';

const summaryMetrics = [
  { key: 'velocidadMaxima', label: 'Velocidad', suffix: 'km/h', decimals: 1 },
  { key: 'distancia', label: 'Distancia', suffix: 'km', decimals: 2 },
  { key: 'minutos', label: 'Minutos', suffix: 'min', decimals: 0 },
  { key: 'goles', label: 'Goles', suffix: '', decimals: 0 },
];

const indicatorCards = [
  { key: 'intensidadSprints', label: 'Intensidad de sprints', suffix: 'sprints/10 min', decimals: 2 },
  { key: 'participacionOfensiva', label: 'Participación ofensiva', suffix: 'pts', decimals: 2 },
  { key: 'eficaciaDefinicion', label: 'Eficacia de definición', suffix: '%', decimals: 2 },
  { key: 'ritmoJuego', label: 'Ritmo de juego', suffix: 'km/min', decimals: 3 },
];

const formatValue = (value, suffix, decimals) => {
  const formatted = formatNumber(value, decimals);
  return suffix ? `${formatted} ${suffix}` : formatted;
};

const buildSearchCorpus = (partido) => {
  const stats = partido.stats || partido;
  const indicators = partido.indicators || {};

  return normalizeSearchText([
    partido.nombrePartido,
    partido.fecha,
    partido.torneo,
    partido.resumen,
    ...summaryMetrics.map((metric) => stats?.[metric.key]),
    ...indicatorCards.map((indicator) => indicators?.[indicator.key]),
  ].join(' '));
};

export default function ResultadosScreen({ navigation }) {
  const { currentUser, getMatchesForCurrentUser } = useAppData();
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadMatches = async () => {
      setLoading(true);
      const matches = await getMatchesForCurrentUser();

      if (isActive) {
        setPartidos(matches);
        setLoading(false);
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

    return partidos.filter((partido) => buildSearchCorpus(partido).includes(searchTerm));
  }, [partidos, search]);

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

  if (partidos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.contentOnly}>
          <Text style={styles.backText}>Resultados</Text>
          <Text style={styles.emptyTitle}>Todavía no tienes resultados</Text>
          <Text style={styles.emptyText}>
            Registra un partido para generar métricas, indicadores y el PDF del jugador.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('UploadMatch')}>
            <Text style={styles.primaryButtonText}>Registrar partido</Text>
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

        <Text style={styles.title}>Resultados</Text>
        <Text style={styles.heading}>Partidos registrados</Text>
        <Text style={styles.description}>
          Selecciona un partido de {[currentUser?.nombre, currentUser?.apellido].filter(Boolean).join(' ') || 'jugador'} para revisar todos los datos, indicadores y generar el PDF.
        </Text>

        <TextInput
          style={styles.searchBar}
          placeholder="Buscar por partido, fecha, torneo o métrica"
          placeholderTextColor="#7E8AA0"
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.resultCount}>
          {filteredMatches.length} de {partidos.length} partidos
        </Text>

        {filteredMatches.map((partido) => {
          const stats = partido.stats || partido;  // ← stats vienen directo del partido
          const indicators = partido.indicators || calculateMatchIndicators(stats);

          return (
            <TouchableOpacity
              key={partido.id}
              style={styles.matchCard}
              onPress={() => navigation.navigate('PartidoDetalle', { matchId: partido.id })}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.matchTitle}>{partido.nombrePartido}</Text>
                  <Text style={styles.matchMeta}>{partido.fecha} · {partido.torneo}</Text>
                </View>
                <Text style={styles.detailText}>Detalle</Text>
              </View>

              <View style={styles.metricGrid}>
                {summaryMetrics.map((metric) => (
                  <View key={metric.key} style={styles.metricBox}>
                    <Text style={styles.metricValue}>
                      {formatValue(stats?.[metric.key], metric.suffix, metric.decimals)}
                    </Text>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.indicatorGrid}>
                {indicatorCards.map((indicator) => (
                  <View key={indicator.key} style={styles.indicatorBox}>
                    <Text style={styles.indicatorLabel}>{indicator.label}</Text>
                    <Text style={styles.indicatorValue}>
                      {formatValue(indicators?.[indicator.key], indicator.suffix, indicator.decimals)}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredMatches.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No se encontraron partidos</Text>
            <Text style={styles.emptyText}>
              Ajusta la búsqueda para ver otros partidos registrados.
            </Text>
          </View>
        )}
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
  searchBar: {
    backgroundColor: '#101827',
    borderRadius: 14,
    padding: 15,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#233047',
  },
  resultCount: {
    color: '#8A94A6',
    marginBottom: 14,
    fontWeight: '600',
  },
  matchCard: {
    borderWidth: 1,
    borderColor: '#12355C',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    backgroundColor: 'rgba(12, 20, 39, 0.94)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  matchTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  matchMeta: {
    color: '#9DB2C8',
    fontSize: 13,
    marginTop: 6,
  },
  detailText: {
    color: '#00CFFF',
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricBox: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: '#091325',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#17385C',
  },
  metricValue: {
    color: '#00CFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  metricLabel: {
    color: '#9DB2C8',
    fontSize: 12,
    marginTop: 6,
  },
  indicatorGrid: {
    borderTopWidth: 1,
    borderTopColor: '#182235',
    paddingTop: 10,
  },
  indicatorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  indicatorLabel: {
    color: '#B9C2D0',
    flex: 1,
  },
  indicatorValue: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'right',
  },
  emptyCard: {
    backgroundColor: '#121826',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#202833',
    padding: 18,
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
