import UserModel from '../models/UserModel.js';
import DatabaseService from '../services/DatabaseService.js';

class AuthController {
  constructor() {
    this.userModel = UserModel;
    // Fallback en memoria para cuando la BD falla (ej: web)
    this.inMemoryUsers = [
      {
        id: 1,
        email: 'juan.gonzales@email.com',
        correo: 'juan.gonzales@email.com',
        usuario: 'juang10',
        password: '123456',
        nombre: 'Juan',
        apellido: 'Gonzales',
        edad: '21',
        fechaNacimiento: '21',
        posicion: 'Delantero',
      },
    ];
    this.useInMemory = false;
  }

  async init() {
    try {
      console.log('[AuthController.init] Starting initialization...');
      
      console.log('[AuthController.init] Initializing DatabaseService...');
      await DatabaseService.init();
      console.log('[AuthController.init] DatabaseService initialized');
      
      console.log('[AuthController.init] Initializing UserModel...');
      await this.userModel.init();
      console.log('[AuthController.init] UserModel initialized');

      console.log('[AuthController.init] Fetching existing users...');
      const users = await this.userModel.getAll();
      console.log('[AuthController.init] Found', users?.length || 0, 'users');
      
      if (!users || users.length === 0) {
        console.log('[AuthController.init] No users found, seeding demo user...');
        const demoUser = {
          email: 'juan.gonzales@email.com',
          correo: 'juan.gonzales@email.com',
          usuario: 'juang10',
          password: '123456',
          nombre: 'Juan',
          apellido: 'Gonzales',
          edad: '21',
          fechaNacimiento: '21',
          posicion: 'Delantero',
        };
        console.log('[AuthController.init] Creating demo user:', demoUser.usuario);
        await this.userModel.create(demoUser);
        console.log('[AuthController.init] Demo user created successfully');
      } else {
        console.log('[AuthController.init] Users already exist, skipping seed');
        users.forEach((u, i) => {
          console.log(`  User ${i + 1}: usuario=${u.usuario}, email=${u.email}`);
        });
      }
      this.useInMemory = false;
    } catch (error) {
      console.error('[AuthController.init] Database initialization failed:', error);
      console.log('[AuthController.init] Falling back to in-memory authentication');
      this.useInMemory = true;
    }
  }

  async register(userData) {
    // Validate input
    if (!userData.correo || !userData.password || !userData.usuario) {
      throw new Error('Correo, usuario y contraseña son requeridos');
    }

    if (this.useInMemory) {
      console.log('[AuthController.register] Using in-memory registration (data will not persist)');
      // Check in-memory
      const exists = this.inMemoryUsers.some(
        u => u.correo === userData.correo || u.usuario === userData.usuario
      );
      if (exists) {
        throw new Error('Usuario o correo ya registrados');
      }
      
      // Create new user in memory
      const newUser = {
        id: (this.inMemoryUsers.length + 1),
        ...userData,
      };
      this.inMemoryUsers.push(newUser);
      return newUser;
    }

    // Check if user already exists by correo or usuario
    const existingUserByCorreo = await this.userModel.findByLogin(userData.correo);
    const existingUserByUsuario = await this.userModel.findByLogin(userData.usuario);
    if (existingUserByCorreo || existingUserByUsuario) {
      throw new Error('Usuario o correo ya registrados');
    }

    // Create user in database
    const userId = await this.userModel.create(userData);
    const user = await this.userModel.findById(userId);

    return user;
  }

  async login(login, password) {
    try {
      console.log('[AuthController.login] Attempting login with login:', login);
      
      let user;
      
      if (this.useInMemory) {
        console.log('[AuthController.login] Using in-memory authentication');
        user = this.inMemoryUsers.find(
          u => u.usuario === login || u.correo === login || u.email === login
        );
      } else {
        // Find user by correo, usuario or email from database
        user = await this.userModel.findByLogin(login);
      }
      
      console.log('[AuthController.login] User lookup result:', user ? `Found user ${user.usuario}` : 'User not found');
      
      if (!user) {
        throw new Error('Usuario o correo no encontrado');
      }

      // Check password (in real app, use hash)
      console.log('[AuthController.login] Validating password...');
      if (user.password !== password) {
        throw new Error('Contraseña inválida');
      }

      console.log('[AuthController.login] Login successful for user:', user.usuario);
      return user;
    } catch (error) {
      console.error('[AuthController.login] Login error:', error.message);
      throw error;
    }
  }

  async logout() {
    // In a real app, might clear tokens, but here just return success
    return true;
  }

  async getCurrentUser(userId) {
    if (this.useInMemory) {
      return this.inMemoryUsers.find(u => u.id === userId);
    }
    return await this.userModel.findById(userId);
  }
}

export default new AuthController();