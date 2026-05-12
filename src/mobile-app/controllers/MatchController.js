import MatchModel from '../models/MatchModel.js';
import DatabaseService from '../services/DatabaseService.js';
import {
  MATCH_STAT_KEYS,
  buildMatchResumen,
  calculateMatchIndicators,
  getMatchStats,
  toFiniteNumber,
} from '../utils/matchMetrics.js';

class MatchController {
  constructor() {
    this.matchModel = MatchModel;
    this.inMemoryMatches = []; // Fallback storage
    this.useInMemory = false;
    this.fallbackStorageKey = 'metrics_analytics_matches';
  }

  async init() {
    try {
      console.log('[MatchController.init] Starting initialization...');
      const db = await DatabaseService.init();
      await this.matchModel.init();

      if (!db || !this.matchModel.db) {
        console.log('[MatchController.init] Database unavailable, using in-memory storage');
        this.useInMemory = true;
        this.loadFallbackMatches();
        return;
      }

      console.log('[MatchController.init] Initialization successful');
      this.useInMemory = false;
    } catch (error) {
      console.error('[MatchController.init] Database initialization failed:', error);
      console.log('[MatchController.init] Falling back to in-memory storage');
      this.useInMemory = true;
      this.loadFallbackMatches();
    }
  }

  loadFallbackMatches() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const storedMatches = JSON.parse(window.localStorage.getItem(this.fallbackStorageKey) || '[]');
      this.inMemoryMatches = Array.isArray(storedMatches) ? storedMatches : [];
    } catch (error) {
      console.warn('[MatchController.loadFallbackMatches] Could not load fallback matches:', error.message);
      this.inMemoryMatches = [];
    }
  }

  persistFallbackMatches() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(this.fallbackStorageKey, JSON.stringify(this.inMemoryMatches));
    } catch (error) {
      console.warn('[MatchController.persistFallbackMatches] Could not persist fallback matches:', error.message);
    }
  }

  generateRandomStats() {
    return {
      velocidadMaxima: Math.random() * 8 + 28, // 28-35 km/h
      distancia: Math.random() * 8 + 7.5, // 7.5-15.5 km
      sprints: Math.floor(Math.random() * 20) + 10, // 10-30
      goles: Math.floor(Math.random() * 4), // 0-3
      tiros: Math.floor(Math.random() * 9) + 3, // 3-12
      pases: Math.floor(Math.random() * 28) + 12, // 12-40
      vision: Math.random() * 40 + 50, // 50-90
      precision: Math.random() * 40 + 50, // 50-90
      rendimiento: Math.random() * 40 + 50, // 50-90
      minutos: Math.floor(Math.random() * 25) + 55, // 55-80
    };
  }

  buildResumen(stats) {
    return buildMatchResumen(stats);
  }

  buildManualStats(matchData) {
    return MATCH_STAT_KEYS.reduce((stats, key) => {
      stats[key] = toFiniteNumber(matchData[key]);
      return stats;
    }, {});
  }

  calculateIndicators(stats) {
    return calculateMatchIndicators(stats);
  }

  normalizeMatch(match) {
    if (!match) return null;
    const stats = getMatchStats(match);
    const indicators = match.indicators || this.calculateIndicators(stats);

    return {
      ...match,
      stats,
      indicators,
    };
  }

  async createMatch(userId, matchData) {
    const { nombrePartido, fecha, torneo, velocidadMaxima, distancia, sprints, goles, tiros, pases, vision, precision, rendimiento, minutos } = matchData;

    // Check if manual stats were provided
    const hasManualStats = velocidadMaxima !== undefined && distancia !== undefined && sprints !== undefined && 
                          goles !== undefined && tiros !== undefined && pases !== undefined && 
                          vision !== undefined && precision !== undefined && rendimiento !== undefined && minutos !== undefined;

    let stats;
    if (hasManualStats) {
      // Use provided stats
      stats = this.buildManualStats(matchData);
      console.log('[MatchController.createMatch] Using manual stats:', stats);
    } else {
      // Generate random stats
      stats = this.generateRandomStats();
      console.log('[MatchController.createMatch] Generated random stats:', stats);
    }

    const resumen = this.buildResumen(stats);
    const indicators = this.calculateIndicators(stats);

    // Create match ID
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    const match = {
      id,
      userId,
      nombrePartido,
      fecha,
      torneo,
      ...stats,
      stats,
      indicators,
      resumen,
      createdAt,
    };

    if (this.useInMemory) {
      console.log('[MatchController.createMatch] Storing match in memory');
      this.inMemoryMatches.push(match);
      this.persistFallbackMatches();
    } else {
      await this.matchModel.create(match);
    }

    return match;
  }

  async getMatchById(id) {
    let match;
    if (this.useInMemory) {
      match = this.inMemoryMatches.find(m => m.id === id);
    } else {
      match = await this.matchModel.findById(id);
    }
    return this.normalizeMatch(match);
  }

  async getMatchesByUser(userId) {
    let matches;
    if (this.useInMemory) {
      matches = this.inMemoryMatches
        .filter(m => m.userId === userId)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      matches = await this.matchModel.findByUserId(userId);
    }
    return matches.map((match) => this.normalizeMatch(match));
  }

  async getAllMatches() {
    let matches;
    if (this.useInMemory) {
      matches = [...this.inMemoryMatches].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      matches = await this.matchModel.getAll();
    }
    return matches.map((match) => this.normalizeMatch(match));
  }

  async updateMatch(id, matchData) {
    if (this.useInMemory) {
      const match = this.inMemoryMatches.find(m => m.id === id);
      if (match) {
        Object.assign(match, matchData);
        const stats = this.buildManualStats(match);
        match.stats = stats;
        match.indicators = this.calculateIndicators(stats);
        match.resumen = this.buildResumen(stats);
        this.persistFallbackMatches();
        return this.normalizeMatch(match);
      }
      return null;
    } else {
      await this.matchModel.update(id, matchData);
      return this.normalizeMatch(await this.matchModel.findById(id));
    }
  }

  async deleteMatch(id) {
    if (this.useInMemory) {
      const index = this.inMemoryMatches.findIndex(m => m.id === id);
      if (index > -1) {
        this.inMemoryMatches.splice(index, 1);
        this.persistFallbackMatches();
      }
    } else {
      await this.matchModel.delete(id);
    }
  }
}

export default new MatchController();