import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AuthController from '../controllers/AuthController.js';
import MatchController from '../controllers/MatchController.js';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      console.log('[AppDataContext] Starting app initialization...');
      try {
        console.log('[AppDataContext] Initializing AuthController...');
        await AuthController.init();
        console.log('[AppDataContext] AuthController initialized successfully');
        
        console.log('[AppDataContext] Initializing MatchController...');
        await MatchController.init();
        console.log('[AppDataContext] MatchController initialized successfully');
        
        console.log('[AppDataContext] App initialization completed');
      } catch (error) {
        console.error('[AppDataContext] Error initializing app:', error);
      } finally {
        console.log('[AppDataContext] Setting isLoading to false');
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (login, password) => {
    try {
      console.log('[AppDataContext.login] Starting login process with login:', login);
      const user = await AuthController.login(login, password);
      console.log('[AppDataContext.login] Login successful, setting currentUser:', user.usuario);
      setCurrentUser(user);
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.error('[AppDataContext.login] Login error:', error.message);
      return {
        ok: false,
        message: error.message,
      };
    }
  };

  const register = async (payload) => {
    try {
      const user = await AuthController.register({
        correo: payload.correo,
        usuario: payload.usuario,
        password: payload.password,
        nombre: payload.nombre,
        apellido: payload.apellido,
        edad: payload.edad,
        fechaNacimiento: payload.edad,
        posicion: payload.posicion || '',
      });
      setCurrentUser(user);
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.error('Register error:', error.message);
      return {
        ok: false,
        message: error.message,
      };
    }
  };

  const logout = async () => {
    try {
      await AuthController.logout();
      setCurrentUser(null);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const addMatchForCurrentUser = async (matchPayload) => {
    if (!currentUser) {
      return {
        ok: false,
        message: 'No hay un usuario autenticado.',
      };
    }

    try {
      const match = await MatchController.createMatch(currentUser.id, matchPayload);
      return {
        ok: true,
        match,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  };

  const getMatchById = async (matchId) => {
    try {
      return await MatchController.getMatchById(matchId);
    } catch (error) {
      console.error('Error getting match:', error);
      return null;
    }
  };

  const getMatchesForCurrentUser = async () => {
    if (!currentUser) return [];
    try {
      return await MatchController.getMatchesByUser(currentUser.id);
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    login,
    register,
    logout,
    addMatchForCurrentUser,
    getMatchById,
    getMatchesForCurrentUser,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData debe usarse dentro de AppDataProvider');
  }

  return context;
}
