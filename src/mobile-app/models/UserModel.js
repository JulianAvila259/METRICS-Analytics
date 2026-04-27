import DatabaseService from '../services/DatabaseService.js';

class UserModel {
  constructor() {
    this.db = null;
  }

  async init() {
    try {
      this.db = await DatabaseService.init();
      console.log('[UserModel.init] Database initialized:', !!this.db);
    } catch (error) {
      console.warn('[UserModel.init] Database not available:', error.message);
      this.db = null;
    }
  }

  async create(userData) {
    if (!this.db) {
      throw new Error('Database not available');
    }
    
    const {
      email, correo, usuario, password, nombre, apellido, edad,
      fechaNacimiento, posicion,
    } = userData;

    const result = await this.db.runAsync(
      'INSERT INTO users (email, correo, usuario, password, nombre, apellido, edad, fechaNacimiento, posicion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, correo, usuario, password, nombre, apellido, edad, fechaNacimiento, posicion]
    );

    return result.lastInsertRowId;
  }

  async findByLogin(login) {
    if (!this.db) {
      throw new Error('Database not available');
    }
    
    const result = await this.db.getFirstAsync(
      'SELECT * FROM users WHERE correo = ? OR usuario = ? OR email = ?',
      [login, login, login]
    );
    return result;
  }

  async findById(id) {
    if (!this.db) {
      throw new Error('Database not available');
    }
    
    const result = await this.db.getFirstAsync('SELECT * FROM users WHERE id = ?', [id]);
    return result;
  }

  async getAll() {
    if (!this.db) {
      throw new Error('Database not available');
    }
    
    const result = await this.db.getAllAsync('SELECT * FROM users');
    return result;
  }

  async update(id, userData) {
    const { nombre, apellido, fechaNacimiento, posicion } = userData;

    await this.db.runAsync(
      'UPDATE users SET nombre = ?, apellido = ?, fechaNacimiento = ?, posicion = ? WHERE id = ?',
      [nombre, apellido, fechaNacimiento, posicion, id]
    );
  }

  async delete(id) {
    await this.db.runAsync('DELETE FROM users WHERE id = ?', [id]);
  }
}

export default new UserModel();