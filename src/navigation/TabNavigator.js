import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; // Importante adicionar aqui
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CosmosScreen from '../screens/main/CosmosScreen'; 
import ChatScreen from '../screens/main/ChatScreen';
import StoreScreen from '../screens/main/StoreScreen';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      // ADICIONADO: Esse listener faz vibrar em QUALQUER aba que o usuário tocar
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Vibração suave para navegação
        },
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: Colors.background, 
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Cosmos') {
            iconName = focused ? 'moon' : 'moon-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Mercado') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Cosmos" component={CosmosScreen} />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ tabBarHideOnKeyboard: true }}
      />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Mercado" component={StoreScreen} />
    </Tab.Navigator>
  );
}