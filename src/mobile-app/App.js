import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResultadosScreen from './screens/ResultadosScreen';
import UploadMatchScreen from './screens/UploadMatchScreen';
import PartidoDetalleScreen from './screens/PartidoDetalleScreen';
import { AppDataProvider } from './context/AppDataContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppDataProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Resultados" component={ResultadosScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="UploadMatch" component={UploadMatchScreen} />
          <Stack.Screen name="PartidoDetalle" component={PartidoDetalleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppDataProvider>
  );
}
