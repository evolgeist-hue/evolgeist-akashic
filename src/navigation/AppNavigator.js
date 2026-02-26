import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importações com caminhos verificados
import LoginScreen from '../screens/auth/LoginScreen'; 
import SignUpScreen from '../screens/auth/SignUpScreen'; 
import TabNavigator from './TabNavigator'; 

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} /> 
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}