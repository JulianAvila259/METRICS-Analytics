import { Alert, Platform } from 'react-native';

const escapePdfText = (text) =>
  String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const buildPdfText = (title, lines) => {
  const commands = ['BT', '/F1 18 Tf', '1 0 0 1 50 800 Tm', `(${escapePdfText(title)}) Tj`];

  lines.forEach((line, index) => {
    const y = 770 - index * 20;
    commands.push('/F1 11 Tf', `1 0 0 1 50 ${y} Tm`, `(${escapePdfText(line)}) Tj`);
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

const formatFileSize = (size) => {
  if (!size) {
    return 'No disponible';
  }

  const sizeInMb = size / (1024 * 1024);
  return `${sizeInMb.toFixed(1)} MB`;
};

export const downloadMatchPdf = async (match, currentUser) => {
  const lines = [
    'Resumen del jugador',
    `Jugador: ${currentUser.nombre} ${currentUser.apellido}`,
    `Usuario: ${currentUser.usuario}`,
    `Correo: ${currentUser.correo}`,
    `Edad: ${currentUser.edad}`,
    ' ',
    'Datos del partido',
    `Partido: ${match.nombrePartido}`,
    `Fecha: ${match.fecha}`,
    `Competencia: ${match.torneo}`,
    `Video: ${match.videoNombre}`,
    `Tamaño del video: ${formatFileSize(match.videoSize)}`,
    `Fecha de registro: ${new Date(match.createdAt).toLocaleString()}`,
    ' ',
    'Metricas generadas',
    `Velocidad maxima: ${match.stats.velocidadMaxima} km/h`,
    `Distancia recorrida: ${match.stats.distancia} km`,
    `Sprints: ${match.stats.sprints}`,
    `Goles: ${match.stats.goles}`,
    `Tiros: ${match.stats.tiros}`,
    `Pases: ${match.stats.pases}`,
    `Vision: ${match.stats.vision}`,
    `Precision: ${match.stats.precision}`,
    `Rendimiento: ${match.stats.rendimiento}`,
    `Minutos jugados: ${match.stats.minutos}`,
    ' ',
    `Resumen corto: ${match.resumen}`,
  ];

  const pdfText = buildMinimalPdf(`Paquete de partido - ${match.nombrePartido}`, lines);

  if (Platform.OS !== 'web') {
    Alert.alert(
      'PDF preparado',
      'La descarga automática del PDF se configuró para entorno web. En móvil puedes extenderlo luego con guardado nativo.'
    );
    return;
  }

  const blob = new Blob([pdfText], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${match.nombrePartido.replace(/\s+/g, '_').toLowerCase()}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};
