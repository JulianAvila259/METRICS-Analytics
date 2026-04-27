import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;
    this.sqliteAvailable = true;
  }

  async init() {
    console.log('[DatabaseService.init] Starting database initialization...');
    
    // Check if SQLite is available (might not be in web)
    if (typeof SQLite === 'undefined' || !SQLite.openDatabaseAsync) {
      console.warn('[DatabaseService.init] SQLite not available, falling back to in-memory storage');
      this.sqliteAvailable = false;
      return null;
    }

    if (this.db) {
      console.log('[DatabaseService.init] Database already initialized, returning existing instance');
      return this.db;
    }

    try {
      console.log('[DatabaseService.init] Opening database...');
      this.db = await SQLite.openDatabaseAsync('metrics_analytics.db');
      console.log('[DatabaseService.init] Database opened successfully');

      console.log('[DatabaseService.init] Creating tables...');
      await this.createTables();
      console.log('[DatabaseService.init] Tables created successfully');

      return this.db;
    } catch (error) {
      console.error('[DatabaseService.init] Error initializing database:', error);
      this.sqliteAvailable = false;
      return null;
    }
  }

  async createTables() {
    const db = await this.init();

    // Users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        correo TEXT UNIQUE,
        usuario TEXT UNIQUE,
        password TEXT NOT NULL,
        nombre TEXT,
        apellido TEXT,
        edad TEXT,
        fechaNacimiento TEXT,
        posicion TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.ensureUserColumns(db);

    // Matches table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        userId INTEGER NOT NULL,
        nombrePartido TEXT NOT NULL,
        fecha TEXT NOT NULL,
        torneo TEXT,
        velocidadMaxima REAL,
        distancia REAL,
        sprints INTEGER,
        goles INTEGER,
        tiros INTEGER,
        pases INTEGER,
        vision REAL,
        precision REAL,
        rendimiento REAL,
        minutos INTEGER,
        resumen TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `);
  }

  async ensureUserColumns(db) {
    const alterStatements = [
      'ALTER TABLE users ADD COLUMN correo TEXT',
      'ALTER TABLE users ADD COLUMN usuario TEXT',
      'ALTER TABLE users ADD COLUMN edad TEXT',
      'ALTER TABLE users ADD COLUMN fechaNacimiento TEXT',
      'ALTER TABLE users ADD COLUMN posicion TEXT',
    ];

    for (const statement of alterStatements) {
      try {
        await db.execAsync(statement);
      } catch (error) {
        // Column already exists or table not ready; ignore.
      }
    }
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default new DatabaseService();