import React, { createContext, useContext, useMemo, useState } from 'react';

const AppDataContext = createContext(null);

const randomBetween = (min, max, decimals = 0) => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
};

const buildStatsSummary = (stats) => {
  return `${stats.velocidadMaxima} km/h · ${stats.distancia} km · ${stats.sprints} sprints`;
};

const createRandomStats = () => {
  return {
    velocidadMaxima: randomBetween(28, 35, 1),
    distancia: randomBetween(7.5, 15.8, 1),
    sprints: randomBetween(10, 25, 0),
    goles: randomBetween(0, 3, 0),
    tiros: randomBetween(2, 12, 0),
    pases: randomBetween(12, 40, 0),
    vision: randomBetween(55, 95, 0),
    precision: randomBetween(50, 95, 0),
    rendimiento: randomBetween(60, 98, 0),
    minutos: randomBetween(55, 90, 0),
  };
};

const createMatch = ({ nombrePartido, fecha, torneo, video }) => {
  const stats = createRandomStats();

  return {
    id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
    nombrePartido,
    fecha,
    torneo,
    videoNombre: video?.name || 'video_partido.mp4',
    videoSize: video?.size || null,
    stats,
    resumen: buildStatsSummary(stats),
    createdAt: new Date().toISOString(),
  };
};

const initialUsers = [
  {
    id: 'user-1',
    nombre: 'Juan',
    apellido: 'Gonzales',
    edad: '21',
    correo: 'juan.gonzales@email.com',
    usuario: 'juang10',
    password: '123456',
    partidos: [
      createMatch({
        nombrePartido: 'Futbol Club Magma',
        fecha: '22 abril 2024',
        torneo: 'Torneo Regional',
        video: { name: 'magma-vs-vortex.mp4', size: 228000000 },
      }),
      createMatch({
        nombrePartido: 'CD Nova Force',
        fecha: '18 abril 2024',
        torneo: 'Liga Metropolitana',
        video: { name: 'nova-force.mp4', size: 175000000 },
      }),
      createMatch({
        nombrePartido: 'Atlético Vortex',
        fecha: '10 abril 2024',
        torneo: 'Copa de la Ciudad',
        video: { name: 'atletico-vortex.mp4', size: 190000000 },
      }),
    ],
  },
  {
    id: 'user-2',
    nombre: 'Daniela',
    apellido: 'Ruiz',
    edad: '24',
    correo: 'daniela.ruiz@email.com',
    usuario: 'danir8',
    password: '123456',
    partidos: [
      createMatch({
        nombrePartido: 'Copa Femenina Aurora',
        fecha: '04 mayo 2024',
        torneo: 'Copa Regional',
        video: { name: 'aurora-cup.mp4', size: 160000000 },
      }),
    ],
  },
];

export function AppDataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) || null,
    [users, currentUserId]
  );

  const login = (usuario, password) => {
    const trimmedUser = usuario.trim().toLowerCase();
    const foundUser = users.find(
      (user) => user.usuario.toLowerCase() === trimmedUser && user.password === password
    );

    if (!foundUser) {
      return {
        ok: false,
        message: 'Usuario o contraseña incorrectos.',
      };
    }

    setCurrentUserId(foundUser.id);
    return {
      ok: true,
      user: foundUser,
    };
  };

  const register = (payload) => {
    const normalizedUser = payload.usuario.trim().toLowerCase();
    const normalizedEmail = payload.correo.trim().toLowerCase();

    const userExists = users.some(
      (user) =>
        user.usuario.toLowerCase() === normalizedUser ||
        user.correo.toLowerCase() === normalizedEmail
    );

    if (userExists) {
      return {
        ok: false,
        message: 'Ya existe un usuario o correo registrado con esos datos.',
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      nombre: payload.nombre.trim(),
      apellido: payload.apellido.trim(),
      edad: payload.edad.trim(),
      correo: normalizedEmail,
      usuario: normalizedUser,
      password: payload.password,
      partidos: [],
    };

    setUsers((previous) => [...previous, newUser]);

    return {
      ok: true,
      user: newUser,
    };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const addMatchForCurrentUser = (matchPayload) => {
    if (!currentUser) {
      return {
        ok: false,
        message: 'No hay un usuario autenticado.',
      };
    }

    const match = createMatch(matchPayload);

    setUsers((previous) =>
      previous.map((user) =>
        user.id === currentUser.id
          ? { ...user, partidos: [match, ...user.partidos] }
          : user
      )
    );

    return {
      ok: true,
      match,
    };
  };

  const getMatchById = (matchId) => {
    return currentUser?.partidos.find((match) => match.id === matchId) || null;
  };

  const value = {
    users,
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    logout,
    addMatchForCurrentUser,
    getMatchById,
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
