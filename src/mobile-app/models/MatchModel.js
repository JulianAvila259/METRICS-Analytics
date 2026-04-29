import DatabaseService from '../services/DatabaseService.js';

class MatchModel {
  constructor() {
    this.db = null;
  }

  async init() {
    try {
      this.db = await DatabaseService.init();
      console.log('[MatchModel.init] Database initialized:', !!this.db);
    } catch (error) {
      console.warn('[MatchModel.init] Database not available:', error.message);
      this.db = null;
    }
  }

  async create(matchData) {
    if (!this.db) {
      throw new Error('Database not available');
    }
    
    const {
      id, userId, nombrePartido, fecha, torneo,
      velocidadMaxima, distancia, sprints, goles, tiros, pases,
      vision, precision, rendimiento, minutos, resumen
    } = matchData;
    const createdAt = matchData.createdAt || new Date().toISOString();

    await this.db.runAsync(`
      INSERT INTO matches (
        id, userId, nombrePartido, fecha, torneo,
        velocidadMaxima, distancia, sprints, goles, tiros, pases,
        vision, precision, rendimiento, minutos, resumen, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, nombrePartido, fecha, torneo,
      velocidadMaxima, distancia, sprints, goles, tiros, pases,
      vision, precision, rendimiento, minutos, resumen, createdAt
    ]);
  }

  async findById(id) {
    const result = await this.db.getFirstAsync('SELECT * FROM matches WHERE id = ?', [id]);
    return result;
  }

  async findByUserId(userId) {
    const result = await this.db.getAllAsync('SELECT * FROM matches WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return result;
  }

  async getAll() {
    const result = await this.db.getAllAsync('SELECT * FROM matches ORDER BY createdAt DESC');
    return result;
  }

  async update(id, matchData) {
    const {
      nombrePartido, fecha, torneo,
      velocidadMaxima, distancia, sprints, goles, tiros, pases,
      vision, precision, rendimiento, minutos, resumen
    } = matchData;

    await this.db.runAsync(`
      UPDATE matches SET
        nombrePartido = ?, fecha = ?, torneo = ?,
        velocidadMaxima = ?, distancia = ?, sprints = ?, goles = ?, tiros = ?, pases = ?,
        vision = ?, precision = ?, rendimiento = ?, minutos = ?, resumen = ?
      WHERE id = ?
    `, [
      nombrePartido, fecha, torneo,
      velocidadMaxima, distancia, sprints, goles, tiros, pases,
      vision, precision, rendimiento, minutos, resumen, id
    ]);
  }

  async delete(id) {
    await this.db.runAsync('DELETE FROM matches WHERE id = ?', [id]);
  }
}

export default new MatchModel();
