import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AkashicChatScreen from "./src/screens/main/AkashicChatScreen";
import { supabase } from './src/services/SupabaseService';

// Navegação principal e Telas
import MainTabNavigator from './src/navigation/MainTabNavigator';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import RitualScreen from './src/screens/main/RitualScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HomeScreen from './src/screens/main/HomeScreen'; // Certifique-se que o import existe

// 🔒 MODO SEGURO PARA BUILD (APK nunca quebra)
const USE_MOCK_MODE = true;

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
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

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Função SafeHome para envolver a HomeScreen
  function SafeHome({ navigation }) {
    return <HomeScreen navigation={navigation} />;
  }

  if (loadingSession) {
    return null; 
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          // 🔐 FLUXO AUTENTICADO
          <Stack.Group>
            {/* Se você usa o MainTabNavigator como base, a Home geralmente está dentro dele.
               Mas conforme solicitado, incluímos a SafeHome aqui.
            */}
            <Stack.Screen name="Main" component={MainTabNavigator} />
<Stack.Screen name="AkashicChat" component={AkashicChatScreen} />
            {!USE_MOCK_MODE && (
              <>
                <Stack.Screen name="OracleHistory" component={HistoryScreen} />
                <Stack.Screen name="Ritual" component={RitualScreen} />
              </>
            )}
            
            {/* Caso queira que History e Ritual funcionem mesmo no MOCK_MODE (para teste), 
               mova-os para fora do bloco !USE_MOCK_MODE 
            */}
            
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