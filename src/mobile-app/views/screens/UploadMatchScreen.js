import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { showMessage } from '../../services/notify';
import { MATCH_STAT_KEYS, toFiniteNumber } from '../../utils/matchMetrics';

const initialForm = {
  nombrePartido: '',
  fecha: '',
  torneo: '',
  velocidadMaxima: '',
  distancia: '',
  sprints: '',
  goles: '',
  tiros: '',
  pases: '',
  vision: '',
  precision: '',
  rendimiento: '',
  minutos: '',
};

const statLabels = {
  velocidadMaxima: 'velocidad máxima',
  distancia: 'distancia recorrida',
  sprints: 'sprints realizados',
  goles: 'goles anotados',
  tiros: 'tiros realizados',
  pases: 'pases realizados',
  vision: 'visión del juego',
  precision: 'precisión',
  rendimiento: 'rendimiento general',
  minutos: 'minutos jugados',
};

export default function UploadMatchScreen({ navigation }) {
  const { addMatchForCurrentUser } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSaveMatch = async () => {
    if (isSaving) {
      return;
    }

    // Validar campos básicos
    const requiredFields = ['nombrePartido', 'fecha', 'torneo'];
    const missingBasic = requiredFields.filter(field => !String(form[field]).trim());
    
    if (missingBasic.length > 0) {
      Alert.alert('Formulario incompleto', 'Debes ingresar nombre del partido, fecha y tipo de competencia.');
      return;
    }

    // Validar estadísticas numéricas
    const missingStats = MATCH_STAT_KEYS.filter(field => {
      const rawValue = String(form[field] ?? '').trim();
      const numericValue = toFiniteNumber(rawValue, Number.NaN);

      return rawValue === '' || !Number.isFinite(numericValue) || numericValue < 0 || (field === 'minutos' && numericValue <= 0);
    });

    if (missingStats.length > 0) {
      Alert.alert(
        'Estadísticas incompletas',
        `Debes ingresar valores numéricos válidos para: ${missingStats.map((field) => statLabels[field]).join(', ')}`
      );
      return;
    }

    // Convertir strings a números
    const matchData = MATCH_STAT_KEYS.reduce((payload, field) => {
      payload[field] = toFiniteNumber(form[field]);
      return payload;
    }, {
      nombrePartido: form.nombrePartido.trim(),
      fecha: form.fecha.trim(),
      torneo: form.torneo.trim(),
    });

    setIsSaving(true);
    try {
      const result = await addMatchForCurrentUser(matchData);

      if (!result.ok) {
        Alert.alert('No fue posible guardar el partido', result.message);
        return;
      }

      showMessage(
        'Partido guardado con éxito',
        'El partido fue guardado correctamente con todos los datos registrados.',
        () => navigation.replace('PartidoDetalle', { matchId: result.match.id })
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingTop: 20 }}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Registrar partido</Text>
        <Text style={styles.description}>
          Ingresa los datos del partido para generar el reporte de métricas en PDF.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del partido"
          placeholderTextColor="#888"
          value={form.nombrePartido}
          onChangeText={(value) => updateField('nombrePartido', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha en que se jugó"
          placeholderTextColor="#888"
          value={form.fecha}
          onChangeText={(value) => updateField('fecha', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Competencia (Torneo Regional, Copa de la Ciudad, etc.)"
          placeholderTextColor="#888"
          value={form.torneo}
          onChangeText={(value) => updateField('torneo', value)}
        />

        <Text style={styles.sectionTitle}>Estadísticas del partido</Text>
        <Text style={styles.sectionDescription}>
          Ingresa las métricas reales del partido para generar el reporte.
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Velocidad máxima (km/h)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 32.5"
              placeholderTextColor="#888"
              value={form.velocidadMaxima}
              onChangeText={(value) => updateField('velocidadMaxima', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Distancia recorrida (km)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 12.3"
              placeholderTextColor="#888"
              value={form.distancia}
              onChangeText={(value) => updateField('distancia', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Sprints realizados</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 25"
              placeholderTextColor="#888"
              value={form.sprints}
              onChangeText={(value) => updateField('sprints', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Goles anotados</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2"
              placeholderTextColor="#888"
              value={form.goles}
              onChangeText={(value) => updateField('goles', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Tiros realizados</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 8"
              placeholderTextColor="#888"
              value={form.tiros}
              onChangeText={(value) => updateField('tiros', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Pases realizados</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 35"
              placeholderTextColor="#888"
              value={form.pases}
              onChangeText={(value) => updateField('pases', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Visión del juego (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 75"
              placeholderTextColor="#888"
              value={form.vision}
              onChangeText={(value) => updateField('vision', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Precisión (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 82"
              placeholderTextColor="#888"
              value={form.precision}
              onChangeText={(value) => updateField('precision', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Rendimiento general (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 78"
              placeholderTextColor="#888"
              value={form.rendimiento}
              onChangeText={(value) => updateField('rendimiento', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statInput}>
            <Text style={styles.statLabel}>Minutos jugados</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 90"
              placeholderTextColor="#888"
              value={form.minutos}
              onChangeText={(value) => updateField('minutos', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveMatch}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Guardando...' : 'Guardar partido'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
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
    marginBottom: 10,
  },
  description: {
    color: '#9DB2C8',
    lineHeight: 22,
    marginBottom: 22,
  },
  input: {
    backgroundColor: '#161B22',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#202833',
  },
  saveButton: {
    backgroundColor: '#00D1FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#9DB2C8',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statInput: {
    width: '48%',
    marginBottom: 16,
  },
  statLabel: {
    color: '#AFC2DD',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  }, 
});
