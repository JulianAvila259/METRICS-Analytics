import MatchModel from '../models/MatchModel.js';
import DatabaseService from '../services/DatabaseService.js';

class MatchController {
  constructor() {
    this.matchModel = MatchModel;
    this.inMemoryMatches = []; // Fallback storage
    this.useInMemory = false;
  }

  async init() {
    try {
      console.log('[MatchController.init] Starting initialization...');
      await DatabaseService.init();
      await this.matchModel.init();
      console.log('[MatchController.init] Initialization successful');
      this.useInMemory = false;
    } catch (error) {
      console.error('[MatchController.init] Database initialization failed:', error);
      console.log('[MatchController.init] Falling back to in-memory storage');
      this.useInMemory = true;
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
    return `${stats.velocidadMaxima.toFixed(1)} km/h · ${stats.distancia.toFixed(1)} km · ${stats.sprints} sprints`;
  }

  normalizeMatch(match) {
    if (!match) return null;
    if (match.stats) return match;

    return {
      ...match,
      stats: {
        velocidadMaxima: match.velocidadMaxima,
        distancia: match.distancia,
        sprints: match.sprints,
        goles: match.goles,
        tiros: match.tiros,
        pases: match.pases,
        vision: match.vision,
        precision: match.precision,
        rendimiento: match.rendimiento,
        minutos: match.minutos,
      },
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
      stats = {
        velocidadMaxima: Number(velocidadMaxima),
        distancia: Number(distancia),
        sprints: Number(sprints),
        goles: Number(goles),
        tiros: Number(tiros),
        pases: Number(pases),
        vision: Number(vision),
        precision: Number(precision),
        rendimiento: Number(rendimiento),
        minutos: Number(minutos),
      };
      console.log('[MatchController.createMatch] Using manual stats:', stats);
    } else {
      // Generate random stats
      stats = this.generateRandomStats();
      console.log('[MatchController.createMatch] Generated random stats:', stats);
    }

    const resumen = this.buildResumen(stats);

    // Create match ID
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const match = {
      id,
      userId,
      nombrePartido,
      fecha,
      torneo,
      ...stats,
      stats,
      resumen,
    };

    if (this.useInMemory) {
      console.log('[MatchController.createMatch] Storing match in memory');
      this.inMemoryMatches.push(match);
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
      matches = this.inMemoryMatches.filter(m => m.userId === userId);
    } else {
      matches = await this.matchModel.findByUserId(userId);
    }
    return matches.map((match) => this.normalizeMatch(match));
  }

  async getAllMatches() {
    let matches;
    if (this.useInMemory) {
      matches = this.inMemoryMatches;
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
        return match;
      }
      return null;
    } else {
      await this.matchModel.update(id, matchData);
      return await this.matchModel.findById(id);
    }
  }

  async deleteMatch(id) {
    if (this.useInMemory) {
      const index = this.inMemoryMatches.findIndex(m => m.id === id);
      if (index > -1) {
        this.inMemoryMatches.splice(index, 1);
      }
    } else {
      await this.matchModel.delete(id);
    }
  }
}

export default new MatchController();