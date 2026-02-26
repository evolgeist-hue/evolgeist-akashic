import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import { supabase } from './src/services/SupabaseService';

// Navegação principal
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Telas de autenticação
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';

// Telas do fluxo principal
import RitualScreen from './src/screens/main/RitualScreen';
import HistoryScreen from './src/screens/HistoryScreen'; 
// ⚠️ Ajuste o caminho acima se seu History estiver em /main

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    // 1. Busca sessão inicial
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((err) => {
        console.error('Erro ao recuperar sessão inicial:', err);
      })
      .finally(() => {
        setLoadingSession(false);
      });

    // 2. Escuta login / logout / signup
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

    // 3. Cleanup
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // 🔒 Evita flash de tela / bugs de navegação
  if (loadingSession) {
    return null; 
    // depois podemos colocar um Splash bonito aqui
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          // 🔐 FLUXO AUTENTICADO
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Ritual" component={RitualScreen} />
            <Stack.Screen name="OracleHistory" component={HistoryScreen} />
          </Stack.Group>
        ) : (
          // 🔓 FLUXO NÃO AUTENTICADO
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}