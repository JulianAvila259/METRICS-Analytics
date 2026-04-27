import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import DashboardScreen from './views/screens/DashboardScreen';
import LoginScreen from './views/screens/LoginScreen';
import PerfilScreen from './views/screens/PerfilScreen';
import RegisterScreen from './views/screens/RegisterScreen';
import ResultadosScreen from './views/screens/ResultadosScreen';
import UploadMatchScreen from './views/screens/UploadMatchScreen';
import PartidoDetalleScreen from './views/screens/PartidoDetalleScreen';
import { AppDataProvider, useAppData } from './context/AppDataContext';

const Stack = createStackNavigator();

function AppContent() {
  const { isLoading } = useAppData();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D1FF" />
        <Text style={styles.loadingText}>Cargando aplicación...</Text>
      </View>
    );
  }

  return (
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
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E17',
  },
  loadingText: {
    color: '#AFC2DD',
    fontSize: 16,
    marginTop: 16,
  },
});
