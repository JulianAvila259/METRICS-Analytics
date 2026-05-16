import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { downloadMatchPdf } from '../../services/pdf';
import { calculateMatchIndicators, formatNumber, getMatchStats } from '../../utils/matchMetrics';

const statItems = [
  { label: 'Velocidad máxima', key: 'velocidadMaxima', suffix: 'km/h', decimals: 1 },
  { label: 'Distancia recorrida', key: 'distancia', suffix: 'km', decimals: 2 },
  { label: 'Sprints realizados', key: 'sprints', suffix: '', decimals: 0 },
  { label: 'Goles anotados', key: 'goles', suffix: '', decimals: 0 },
  { label: 'Tiros realizados', key: 'tiros', suffix: '', decimals: 0 },
  { label: 'Pases realizados', key: 'pases', suffix: '', decimals: 0 },
  { label: 'Visión del juego', key: 'vision', suffix: '%', decimals: 2 },
  { label: 'Precisión', key: 'precision', suffix: '%', decimals: 2 },
  { label: 'Rendimiento general', key: 'rendimiento', suffix: '%', decimals: 2 },
  { label: 'Minutos jugados', key: 'minutos', suffix: 'min', decimals: 0 },
];

const indicatorItems = [
  {
    label: 'Intensidad de sprints',
    key: 'intensidadSprints',
    suffix: 'sprints/10min',
    decimals: 2,
    description: 'Sprints por cada 10 minutos jugados'
  },
  {
    label: 'Participación ofensiva',
    key: 'participacionOfensiva',
    suffix: 'pts',
    decimals: 2,
    description: 'Tiros + goles × 2'
  },
  {
    label: 'Eficacia de definición',
    key: 'eficaciaDefinicion',
    suffix: '%',
    decimals: 2,
    description: 'Porcentaje de tiros convertidos en gol'
  },
  {
    label: 'Ritmo de juego',
    key: 'ritmoJuego',
    suffix: 'km/min',
    decimals: 3,
    description: 'Distancia recorrida por minuto'
  },
];

const formatValue = (value, suffix = '', decimals = 2) => {
  const formatted = formatNumber(value, decimals);
  return suffix ? `${formatted} ${suffix}` : formatted;
};

const formatDateTime = (value) => {
  if (!value) {
    return 'No disponible';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

function DetailRow({ label, value, description }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description && (
          <Text style={{ color: '#5A6A7E', fontSize: 11, marginTop: 2 }}>{description}</Text>
        )}
      </View>
      <Text style={styles.rowValue}>{value || 'No disponible'}</Text>
    </View>
  );
}

export default function PartidoDetalleScreen({ navigation, route }) {
  const { currentUser, getMatchById } = useAppData();
  const { matchId } = route.params;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadMatch = async () => {
      const loadedMatch = await getMatchById(matchId);

      if (isActive) {
        setMatch(loadedMatch);
        setLoading(false);
      }
    };

    loadMatch();

    return () => {
      isActive = false;
    };
  }, [getMatchById, matchId]);

  const stats = useMemo(() => (match ? getMatchStats(match) : null), [match]);
  const indicators = useMemo(
    () => (match ? match.indicators || calculateMatchIndicators(stats) : null),
    [match, stats]
  );
  const playerName = [currentUser?.nombre, currentUser?.apellido].filter(Boolean).join(' ') || 'Jugador';

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Cargando...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No se encontró el partido</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.primaryButtonText}>Volver a partidos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDownload = async () => {
  try {
    const result = await downloadMatchPdf({ ...match, stats, indicators }, currentUser);
    if (result) {
      Alert.alert('PDF generado', result.message);
    }
  } catch (error) {
    console.error('[PDF] Error mensaje:', error?.message);
    console.error('[PDF] Error completo:', JSON.stringify(error));
    if (error?.message?.includes('FileSystem') || error?.message?.includes('cancel')) {
      return;
    }
    Alert.alert('Error', error.message || 'No fue posible generar el PDF.');
  }
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Atrás</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Detalle del partido</Text>
      <Text style={styles.subtitle}>{match.nombrePartido}</Text>
      <Text style={styles.description}>
        Información registrada y calculada para {playerName}.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{match.nombrePartido}</Text>
        <Text style={styles.summarySub}>{match.fecha} · {match.torneo}</Text>
        <Text style={styles.summaryStats}>{match.resumen}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Datos del partido</Text>
        <DetailRow label="Nombre del partido" value={match.nombrePartido} />
        <DetailRow label="Fecha del partido" value={match.fecha} />
        <DetailRow label="Competencia" value={match.torneo} />
        <DetailRow label="Fecha de registro" value={formatDateTime(match.createdAt)} />
        <DetailRow label="Resumen" value={match.resumen} />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Métricas registradas</Text>
        {statItems.map((item) => (
          <DetailRow
            key={item.key}
            label={item.label}
            value={formatValue(stats?.[item.key], item.suffix, item.decimals)}
          />
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Indicadores calculados</Text>
        {indicatorItems.map((item) => (
          <DetailRow
            key={item.key}
            label={item.label}
            value={formatValue(indicators?.[item.key], item.suffix, item.decimals)}
            description={item.description}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadText}>Generar PDF del partido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B1D',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  back: {
    color: '#AFC2DD',
    fontSize: 18,
    marginBottom: 18,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#00D1FF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },
  description: {
    color: '#9DB2C8',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: '#0E1624',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1B2A3A',
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  summarySub: {
    color: '#8A94A6',
    marginTop: 6,
  },
  summaryStats: {
    color: '#00D1FF',
    marginTop: 10,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#0E1624',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1B2A3A',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#182235',
  },
  rowLabel: {
    color: '#9DB2C8',
    flex: 1,
    paddingRight: 8,
  },
  rowValue: {
    color: '#fff',
    flex: 1,
    fontWeight: '700',
    textAlign: 'right',
  },
  downloadButton: {
    marginTop: 6,
    backgroundColor: '#00D1FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  downloadText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050B1D',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#00D1FF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '700',
  },
});
