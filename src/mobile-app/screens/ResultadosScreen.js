import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import BottomNav from '../components/BottomNav';

export default function ResultadosScreen({ navigation }) {
  const player = {
    nombre: 'Daniel Pérez',
    posicion: 'Delantero',
    minutos: '75 min',
    velocidad: '32.4 km/h',
    distancia: '15.8 km',
    goles: 2,
    tiros: 12,
    pases: 19,
    sprints: 19,
  };

  const quickStats = [
    { id: 'velocidad', icon: '⚡', value: '32.4 km/h' },
    { id: 'distancia', icon: '📍', value: '15.8 km' },
    { id: 'sprints', icon: '🏃', value: '19' },
    { id: 'vision', icon: '👁️', value: '65' },
    { id: 'precision', icon: '🎯', value: '65' },
    { id: 'rendimiento', icon: '📊', value: '18' },
  ];

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

        <Text style={styles.heading}>Métricas del jugador descargadas</Text>
        <Text style={styles.description}>
          A continuación, los resultados detallados de {player.nombre}.
        </Text>

        <View style={styles.playerCard}>
          <Image source={require('../data/juang.png')} style={styles.avatar} />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.nombre}</Text>
            <Text style={styles.playerRole}>
              {player.posicion} · {player.minutos}
            </Text>
            <Text style={styles.playerMetrics}>
              {player.velocidad} · {player.distancia} · {player.goles} ⚽ · {player.pases}
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
            <View style={styles.polygonOne} />
            <View style={styles.polygonTwo} />

            <Text style={[styles.radarLabel, styles.labelTop]}>32.4 km/h</Text>
            <Text style={[styles.radarLabel, styles.labelLeftTop]}>15.8 km</Text>
            <Text style={[styles.radarLabel, styles.labelLeft]}>19{`\n`}Sprints</Text>
            <Text style={[styles.radarLabel, styles.labelBottom]}>19{`\n`}Pases</Text>
            <Text style={[styles.radarLabel, styles.labelRightBottom]}>2{`\n`}Goles</Text>
            <Text style={[styles.radarLabel, styles.labelRight]}>12{`\n`}Tiros</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {quickStats.map((stat) => (
            <View key={stat.id} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  statItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 18,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    color: '#39C8FF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
