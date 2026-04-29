export const MATCH_STAT_KEYS = [
  'velocidadMaxima',
  'distancia',
  'sprints',
  'goles',
  'tiros',
  'pases',
  'vision',
  'precision',
  'rendimiento',
  'minutos',
];

export const toFiniteNumber = (value, fallback = 0) => {
  const normalizedValue = typeof value === 'string' ? value.trim().replace(',', '.') : value;
  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : fallback;
};

export const roundNumber = (value, decimals = 2) => {
  const numericValue = toFiniteNumber(value);
  return Number(numericValue.toFixed(decimals));
};

export const formatNumber = (value, decimals = 2) => {
  const roundedValue = roundNumber(value, decimals);
  return String(roundedValue);
};

export const getMatchStats = (match = {}) => {
  if (match.stats) {
    return match.stats;
  }

  return MATCH_STAT_KEYS.reduce((stats, key) => {
    stats[key] = match[key];
    return stats;
  }, {});
};

export const calculateMatchIndicators = (stats = {}) => {
  const sprints = toFiniteNumber(stats.sprints);
  const minutos = toFiniteNumber(stats.minutos);
  const tiros = toFiniteNumber(stats.tiros);
  const goles = toFiniteNumber(stats.goles);
  const distancia = toFiniteNumber(stats.distancia);

  return {
    intensidadSprints: minutos > 0 ? roundNumber((sprints / minutos) * 10, 2) : 0,
    participacionOfensiva: roundNumber(tiros + goles * 2, 2),
    eficaciaDefinicion: tiros > 0 ? roundNumber((goles / tiros) * 100, 2) : 0,
    ritmoJuego: minutos > 0 ? roundNumber(distancia / minutos, 3) : 0,
  };
};

export const buildMatchResumen = (stats = {}) => {
  const velocidadMaxima = formatNumber(stats.velocidadMaxima, 1);
  const distancia = formatNumber(stats.distancia, 1);
  const sprints = formatNumber(stats.sprints, 0);

  return `${velocidadMaxima} km/h - ${distancia} km - ${sprints} sprints`;
};

export const normalizeSearchText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
