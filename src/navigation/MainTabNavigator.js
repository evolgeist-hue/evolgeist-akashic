import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/main/HomeScreen';
import CosmosScreen from '../screens/main/CosmosScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MarketScreen from '../screens/MarketScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

// 🔧 MAPEAMENTO CORRETO: nomes IGUAIS às rotas
const icons = {
  Home: 'home',
  Cosmos: 'planet',
  Histórico: 'journal',
  Mercado: 'sparkles',
  Perfil: 'person',
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          height: 70,
          borderTopColor: 'rgba(212,175,55,0.2)',
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = icons[route.name];

          // 🔒 Proteção extra (boa prática)
          if (!iconName) return null;

          return (
            <Ionicons
              name={focused ? iconName : `${iconName}-outline`}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cosmos" component={CosmosScreen} />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
      <Tab.Screen name="Mercado" component={MarketScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}