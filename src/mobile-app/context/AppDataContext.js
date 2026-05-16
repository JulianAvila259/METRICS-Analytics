import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc,
  query, 
  where,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[Firebase] Escuchando cambios en autenticación...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Firebase] onAuthStateChanged:', firebaseUser?.email || 'No user');
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            });
          } else {
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              nombre: firebaseUser.email?.split('@')[0] || 'Usuario'
            });
          }
        } catch (error) {
          console.error('[Firebase] Error obteniendo datos del usuario:', error);
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email
          });
        }
      } else {
        setCurrentUser(null);
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Función de login
  const login = useCallback(async (email, password) => {
    try {
      console.log('[Firebase] Intentando login con:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[Firebase] Login exitoso:', userCredential.user.email);
      
      return {
        ok: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email
        }
      };
    } catch (error) {
      console.error('[Firebase] Login error:', error.message);
      let mensaje = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/invalid-email':
          mensaje = 'Email inválido';
          break;
        case 'auth/user-disabled':
          mensaje = 'Usuario deshabilitado';
          break;
        case 'auth/user-not-found':
          mensaje = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          mensaje = 'Contraseña incorrecta';
          break;
        default:
          mensaje = error.message;
      }
      
      return {
        ok: false,
        message: mensaje
      };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      console.log('[Firebase] Registrando usuario:', payload.correo);

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        payload.correo, 
        payload.password
      );
      
      const userData = {
        uid: userCredential.user.uid,
        email: payload.correo,
        usuario: payload.usuario,
        nombre: payload.nombre || '',
        apellido: payload.apellido || '',
        edad: payload.edad || '',
        posicion: payload.posicion || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      console.log('[Firebase] Registro exitoso:', payload.correo);
      
      return {
        ok: true,
        user: userData
      };
    } catch (error) {
      console.error('[Firebase] Register error:', error.message);
      let mensaje = 'Error al registrar usuario';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          mensaje = 'El email ya está registrado';
          break;
        case 'auth/invalid-email':
          mensaje = 'Email inválido';
          break;
        case 'auth/weak-password':
          mensaje = 'La contraseña debe tener al menos 6 caracteres';
          break;
        default:
          mensaje = error.message;
      }
      
      return {
        ok: false,
        message: mensaje
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      console.log('[Firebase] Logout exitoso');
      setCurrentUser(null);
      return { ok: true };
    } catch (error) {
      console.error('[Firebase] Logout error:', error.message);
      return { ok: false, message: error.message };
    }
  }, []);

  const addMatchForCurrentUser = useCallback(async (matchPayload) => {
    if (!currentUser) {
      return {
        ok: false,
        message: 'No hay un usuario autenticado.'
      };
    }

    try {
      const matchData = {
        ...matchPayload,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const matchRef = await addDoc(collection(db, 'matches'), matchData);
      
      return {
        ok: true,
        match: { id: matchRef.id, ...matchData }
      };
    } catch (error) {
      console.error('[Firebase] Error creando partido:', error);
      return {
        ok: false,
        message: error.message
      };
    }
  }, [currentUser]);


  const getMatchById = useCallback(async (matchId) => {
    try {
      const matchDoc = await getDoc(doc(db, 'matches', matchId));
      if (matchDoc.exists()) {
        return { id: matchDoc.id, ...matchDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('[Firebase] Error obteniendo partido:', error);
      return null;
    }
  }, []);

  const getMatchesForCurrentUser = useCallback(async () => {
    if (!currentUser) return [];
    
    try {
      const q = query(collection(db, 'matches'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const matches = [];
      querySnapshot.forEach((doc) => {
        matches.push({ id: doc.id, ...doc.data() });
      });
      return matches;
    } catch (error) {
      console.error('[Firebase] Error obteniendo partidos:', error);
      return [];
    }
  }, [currentUser]);

  const value = useMemo(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    login,
    register,
    logout,
    addMatchForCurrentUser,
    getMatchById,
    getMatchesForCurrentUser,
  }), [
    currentUser,
    isLoading,
    login,
    register,
    logout,
    addMatchForCurrentUser,
    getMatchById,
    getMatchesForCurrentUser,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData debe usarse dentro de AppDataProvider');
  }
  return context;
}