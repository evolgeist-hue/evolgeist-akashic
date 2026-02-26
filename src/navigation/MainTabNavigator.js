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

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.background, height: 70, borderTopColor: 'rgba(212,175,55,0.2)' },
        tabBarActiveTintColor: Colors.accent,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = { 'Início': 'home', 'Cosmos': 'planet', 'Histórico': 'journal', 'Mercado': 'sparkles', 'Perfil': 'person' };
          return <Ionicons name={focused ? icons[route.name] : icons[route.name] + '-outline'} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Cosmos" component={CosmosScreen} />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
      <Tab.Screen name="Mercado" component={MarketScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}