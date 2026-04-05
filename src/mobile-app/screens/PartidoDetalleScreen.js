import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { downloadMatchPdf } from '../utils/pdf';

const statItems = [
  { label: 'Velocidad máxima', key: 'velocidadMaxima', suffix: 'km/h' },
  { label: 'Distancia recorrida', key: 'distancia', suffix: 'km' },
  { label: 'Sprints', key: 'sprints', suffix: '' },
  { label: 'Goles', key: 'goles', suffix: '' },
  { label: 'Tiros', key: 'tiros', suffix: '' },
  { label: 'Pases', key: 'pases', suffix: '' },
  { label: 'Visión', key: 'vision', suffix: '' },
  { label: 'Precisión', key: 'precision', suffix: '' },
  { label: 'Rendimiento', key: 'rendimiento', suffix: '' },
  { label: 'Minutos jugados', key: 'minutos', suffix: 'min' },
];

export default function PartidoDetalleScreen({ navigation, route }) {
  const { currentUser, getMatchById } = useAppData();
  const { matchId } = route.params;
  const match = getMatchById(matchId);

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
      await downloadMatchPdf(match, currentUser);
    } catch (error) {
      Alert.alert('Error al descargar', 'No fue posible generar el PDF del partido.');
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
        Información registrada para {currentUser.nombre} {currentUser.apellido}.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{match.nombrePartido}</Text>
        <Text style={styles.summarySub}>{match.fecha} · {match.torneo}</Text>
        <Text style={styles.summaryStats}>{match.resumen}</Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Jugador</Text>
          <Text style={styles.infoValue}>{currentUser.nombre} {currentUser.apellido}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Usuario</Text>
          <Text style={styles.infoValue}>@{currentUser.usuario}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Correo</Text>
          <Text style={styles.infoValue}>{currentUser.correo}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Video</Text>
          <Text style={styles.infoValue}>{match.videoNombre}</Text>
        </View>
      </View>

      <View style={styles.statsSection}>
        {statItems.map((item) => (
          <View key={item.key} style={styles.statRow}>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={styles.statValue}>
              {match.stats[item.key]}{item.suffix ? ` ${item.suffix}` : ''}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadText}>Descargar paquete PDF</Text>
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
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1B2A3A',
    marginBottom: 18,
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
  infoGrid: {
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  infoLabel: {
    color: '#8A94A6',
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: '#0E1624',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1B2A3A',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#182235',
  },
  statLabel: {
    color: '#9DB2C8',
    flex: 1,
    paddingRight: 12,
  },
  statValue: {
    color: '#fff',
    fontWeight: '700',
  },
  downloadButton: {
    marginTop: 22,
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
