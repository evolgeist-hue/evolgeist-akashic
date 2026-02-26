import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/SupabaseService';
import { useNavigation } from '@react-navigation/native';

export const UniversalHeader = ({ userName, stars }) => {
  const navigation = useNavigation();
  const [isMuted, setIsMuted] = useState(false);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View>
          <Text style={styles.welcomeText}>BEM-VINDO AO</Text>
          <Text style={styles.brandText}>EVOLGEIST</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.starsBadge}>
          <Text style={styles.starsText}>✨ {stars}</Text>
        </View>
        
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
          <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={24} color="#FFD700" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#0A0A12', borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 10 },
  welcomeText: { color: '#888', fontSize: 10, fontWeight: 'bold' },
  brandText: { color: '#FFD700', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  userName: { color: '#FFF', fontSize: 12, opacity: 0.8 },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  starsBadge: { backgroundColor: '#1A1A2E', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, borderWidth: 1, borderColor: '#FFD700' },
  starsText: { color: '#FFD700', fontWeight: 'bold' }
});