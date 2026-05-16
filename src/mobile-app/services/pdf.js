import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { calculateMatchIndicators, formatNumber, getMatchStats } from '../utils/matchMetrics';
import * as Sharing from 'expo-sharing';

const escapePdfText = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const buildPdfText = (title, lines) => {
  const commands = ['BT', '/F1 18 Tf', '1 0 0 1 50 800 Tm', `(${escapePdfText(title)}) Tj`];

  lines.forEach((line, index) => {
    const y = 770 - index * 17;
    commands.push('/F1 10 Tf', `1 0 0 1 50 ${y} Tm`, `(${escapePdfText(line)}) Tj`);
  });

  commands.push('ET');
  return commands.join('\n');
};

const getUtf8Length = (value) => {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(value).length;
  }

  return String(value).length;
};

const buildMinimalPdf = (title, lines) => {
  const contentStream = buildPdfText(title, lines);
  const streamLength = getUtf8Length(contentStream);

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(getUtf8Length(pdf));
    pdf += `${object}\n`;
  });

  const xrefStart = getUtf8Length(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdf;
};

const safeFileName = (value) => {
  const normalizedName = String(value || 'partido')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

  return normalizedName || 'partido';
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

const formatValue = (value, suffix = '', decimals = 2) => {
  const formatted = formatNumber(value, decimals);
  return suffix ? `${formatted} ${suffix}` : formatted;
};

const buildMatchPdfLines = (match, currentUser = {}) => {
  const user = currentUser || {};
  const stats = getMatchStats(match);
  const indicators = match.indicators || calculateMatchIndicators(stats);
  const playerName = [user.nombre, user.apellido].filter(Boolean).join(' ') || 'Jugador';

  return [
    'Resumen del jugador',
    `Jugador: ${playerName}`,
    `Usuario: ${user.usuario ? `@${user.usuario}` : 'No disponible'}`,
    `Correo: ${user.correo || 'No disponible'}`,
    `Edad: ${user.edad || 'No disponible'}`,
    `Posicion: ${user.posicion || 'No disponible'}`,
    ' ',
    'Datos del partido',
    `Partido: ${match.nombrePartido}`,
    `Fecha del partido: ${match.fecha}`,
    `Competencia: ${match.torneo}`,
    `Fecha de registro: ${formatDateTime(match.createdAt)}`,
    `Resumen corto: ${match.resumen}`,
    ' ',
    'Metricas registradas',
    `Velocidad maxima: ${formatValue(stats.velocidadMaxima, 'km/h', 1)}`,
    `Distancia recorrida: ${formatValue(stats.distancia, 'km', 2)}`,
    `Sprints realizados: ${formatValue(stats.sprints, '', 0)}`,
    `Goles anotados: ${formatValue(stats.goles, '', 0)}`,
    `Tiros realizados: ${formatValue(stats.tiros, '', 0)}`,
    `Pases realizados: ${formatValue(stats.pases, '', 0)}`,
    `Vision del juego: ${formatValue(stats.vision, '%', 2)}`,
    `Precision: ${formatValue(stats.precision, '%', 2)}`,
    `Rendimiento general: ${formatValue(stats.rendimiento, '%', 2)}`,
    `Minutos jugados: ${formatValue(stats.minutos, 'min', 0)}`,
    ' ',
    'Indicadores calculados',
    `Intensidad de sprints: ${formatValue(indicators.intensidadSprints, 'sprints/10 min', 2)}`,
    `Participacion ofensiva: ${formatValue(indicators.participacionOfensiva, 'pts', 2)}`,
    `Eficacia de definicion: ${formatValue(indicators.eficaciaDefinicion, '%', 2)}`,
    `Ritmo de juego: ${formatValue(indicators.ritmoJuego, 'km/min', 3)}`,
  ];
};

export const downloadMatchPdf = async (match, currentUser) => {
  const fileName = `${safeFileName(match.nombrePartido)}.pdf`;
  const lines = buildMatchPdfLines(match, currentUser);
  const pdfText = buildMinimalPdf(`Paquete de partido - ${match.nombrePartido}`, lines);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const blob = new Blob([pdfText], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);

    return {
      uri: fileName,
      message: 'La descarga del PDF inició en el navegador.',
    };
  }

  const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, pdfText, {
    encoding: 'utf8',
  });

  const canShare = await Sharing.isAvailableAsync();
if (canShare) {
  try {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartir reporte del partido',
    });
  } catch (shareError) {
    console.log('[PDF] Compartir cancelado');
  }
}

  return {
    uri: fileUri,
    message: 'PDF generado correctamente.',
  };
};
