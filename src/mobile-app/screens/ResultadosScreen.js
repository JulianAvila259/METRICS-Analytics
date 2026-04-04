import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import BottomNav from '../components/BottomNav';

export default function ResultadosScreen({ navigation, route }) {
  const selectedPartido = route?.params?.partido;
  const [activeRadarStat, setActiveRadarStat] = useState('velocidad');

  const partido = selectedPartido || {
    equipo: 'Daniel Pérez',
    torneo: 'Partido de muestra',
    fecha: '75 min',
    velocidad: '32.4 km/h',
    distancia: '15.8 km',
    goles: 2,
    tiros: 12,
    pases: 19,
    sprints: 19,
    vision: '65',
    precision: '65',
    rendimiento: '18',
  };

  const radarAxes = [
    { id: 'velocidad', icon: '⚡', label: 'Velocidad', value: partido.velocidad, unit: 'km/h', max: 35 },
    { id: 'distancia', icon: '📍', label: 'Distancia', value: partido.distancia, unit: 'km', max: 12 },
    { id: 'sprints', icon: '🏃', label: 'Sprints', value: partido.sprints, unit: '', max: 25 },
    { id: 'pases', icon: '🎯', label: 'Pases', value: partido.pases, unit: '', max: 30 },
    { id: 'goles', icon: '⚽', label: 'Goles', value: partido.goles, unit: '', max: 5 },
    { id: 'tiros', icon: '🎯', label: 'Tiros', value: partido.tiros, unit: '', max: 18 },
  ];

  const selectedAxis = radarAxes.find((axis) => axis.id === activeRadarStat) || radarAxes[0];

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Partidos</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Resultados</Text>
          <View style={styles.topSpacer} />
        </View>

        <Text style={styles.heading}>
          {selectedPartido ? `Resultados de ${selectedPartido.equipo}` : 'Métricas del jugador descargadas'}
        </Text>
        <Text style={styles.description}>
          {selectedPartido
            ? `A continuación, los resultados del partido ${selectedPartido.equipo} (${selectedPartido.fecha}) en ${selectedPartido.torneo}.`
            : `A continuación, los resultados detallados de ${player.nombre}.`}
        </Text>

        <View style={styles.playerCard}>
          <Image source={require('../data/juang.png')} style={styles.avatar} />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{partido.equipo}</Text>
            <Text style={styles.playerRole}>
              {partido.torneo} · {partido.fecha}
            </Text>
            <Text style={styles.playerMetrics}>
              {partido.velocidad} · {partido.distancia} · {partido.goles} ⚽ · {partido.pases}
            </Text>
          </View>
        </View>

        <View style={styles.radarWrapper}>
          <View style={styles.radarBoard}>
            <View style={styles.outerRing} />
            <View style={styles.middleRing} />
            <View style={styles.innerRing} />
            <View style={styles.axisVertical} />
            <View style={styles.axisHorizontal} />
            <View style={[styles.axisDiagonal, styles.diagonalOne]} />
            <View style={[styles.axisDiagonal, styles.diagonalTwo]} />
            <View style={styles.coreGlow} />

            {radarAxes.map((axis, index) => {
              const angle = (Math.PI / 3) * index - Math.PI / 2;
              const normalized = Math.min(Math.max(axis.value / axis.max, 0), 1);
              const length = 95 * normalized + 20;
              const x = 155 + Math.cos(angle) * length;
              const y = 155 + Math.sin(angle) * length;

              return (
                <React.Fragment key={axis.id}>
                  <View
                    style={[
                      styles.metricLine,
                      {
                        height: length,
                        transform: [{ rotate: `${angle}rad` }],
                        backgroundColor: activeRadarStat === axis.id ? '#39C8FF' : 'rgba(57, 200, 255, 0.3)',
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.radarMarker,
                      {
                        top: y - 16,
                        left: x - 16,
                        backgroundColor: activeRadarStat === axis.id ? '#00D1FF' : '#0C3B74',
                      },
                    ]}
                  >
                    <Text style={styles.markerIcon}>{axis.icon}</Text>
                  </View>
                </React.Fragment>
              );
            })}

          </View>
        </View>

        <View style={styles.radarInfoCard}>
          <Text style={styles.radarInfoTitle}>{selectedAxis.label}</Text>
          <Text style={styles.radarInfoValue}>{selectedAxis.value}{selectedAxis.unit}</Text>
        </View>

        <View style={styles.radarLegend}>
          {radarAxes.map((axis) => (
            <Pressable
              key={axis.id}
              style={[
                styles.legendButton,
                activeRadarStat === axis.id && styles.legendButtonActive,
              ]}
              onPress={() => setActiveRadarStat(axis.id)}
            >
              <Text style={styles.legendIcon}>{axis.icon}</Text>
              <Text style={styles.legendText}>{axis.label}</Text>
            </Pressable>
          ))}
        </View>

        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadText}>⬇ Descargar paquete (223 MB)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav navigation={navigation} activeTab="Resultados" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#060C1A',
  },
  container: {
    flex: 1,
    backgroundColor: '#060C1A',
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 88,
  },
  backArrow: {
    color: '#D7E8FF',
    fontSize: 26,
    lineHeight: 28,
  },
  backText: {
    color: '#D7E8FF',
    fontSize: 16,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  topSpacer: {
    width: 88,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#B7C6E0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1A38',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00AFFF',
    padding: 14,
    marginBottom: 26,
    shadowColor: '#00AFFF',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
    backgroundColor: '#123B7A',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  playerRole: {
    color: '#A9C7EF',
    fontSize: 15,
    marginBottom: 4,
  },
  playerMetrics: {
    color: '#39C8FF',
    fontSize: 16,
    fontWeight: '600',
  },
  radarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  radarBoard: {
    width: 310,
    height: 310,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  outerRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#0097FF',
  },
  middleRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'rgba(0, 151, 255, 0.55)',
  },
  innerRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 151, 255, 0.45)',
  },
  axisVertical: {
    position: 'absolute',
    width: 2,
    height: 230,
    backgroundColor: 'rgba(0, 151, 255, 0.75)',
  },
  axisHorizontal: {
    position: 'absolute',
    width: 230,
    height: 2,
    backgroundColor: 'rgba(0, 151, 255, 0.75)',
  },
  axisDiagonal: {
    position: 'absolute',
    width: 2,
    height: 230,
    backgroundColor: 'rgba(0, 151, 255, 0.4)',
  },
  diagonalOne: {
    transform: [{ rotate: '52deg' }],
  },
  diagonalTwo: {
    transform: [{ rotate: '-52deg' }],
  },
  coreGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 149, 0, 0.18)',
    shadowColor: '#FF9500',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  polygonOne: {
    position: 'absolute',
    width: 128,
    height: 128,
    backgroundColor: 'rgba(255, 149, 0, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 71, 0.55)',
    transform: [{ rotate: '9deg' }, { skewY: '6deg' }],
  },
  polygonTwo: {
    position: 'absolute',
    width: 142,
    height: 142,
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 71, 0.35)',
    transform: [{ rotate: '-8deg' }, { skewX: '4deg' }],
  },
  metricLine: {
    position: 'absolute',
    width: 2,
    left: 154,
    top: 155,
    backgroundColor: 'rgba(57, 200, 255, 0.3)',
    borderRadius: 1,
  },
  radarMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  radarInfoCard: {
    backgroundColor: 'rgba(7, 31, 64, 0.95)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(57, 200, 255, 0.18)',
    alignItems: 'center',
    marginBottom: 16,
  },
  radarInfoTitle: {
    color: '#D7E8FF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  radarInfoValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  radarInfoSubtitle: {
    color: '#8AA8D4',
    fontSize: 12,
    textAlign: 'center',
  },
  radarLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  legendButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#081830',
    borderWidth: 1,
    borderColor: '#152B4F',
    marginBottom: 12,
  },
  legendButtonActive: {
    borderColor: '#00D1FF',
    backgroundColor: '#0F3468',
  },
  legendIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  legendText: {
    color: '#D7E8FF',
    fontSize: 14,
    fontWeight: '600',
  },
  radarLabel: {
    position: 'absolute',
    color: '#E6EEF9',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  labelTop: {
    top: 0,
  },
  labelLeftTop: {
    left: 8,
    top: 66,
  },
  labelLeft: {
    left: 4,
    top: 132,
  },
  labelBottom: {
    bottom: 0,
  },
  labelRightBottom: {
    right: 8,
    top: 190,
  },
  labelRight: {
    right: 4,
    top: 132,
  },
  downloadButton: {
    borderWidth: 2,
    borderColor: '#00AFFF',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  downloadText: {
    color: '#39C8FF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignSelf: 'center',
    minWidth: 170,
    backgroundColor: '#102A62',
    borderWidth: 2,
    borderColor: '#1F8CFF',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  cancelText: {
    color: '#C7D8F6',
    fontSize: 16,
    fontWeight: '600',
  },
});
