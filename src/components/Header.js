import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/SupabaseService';
import { AudioService } from '../services/AudioService';
import Colors from '../constants/Colors';

export default function Header() {
  const [stars, setStars] = useState(0);
  const [userName, setUserName] = useState('Viajante');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    fetchUserData();
    
    // Inscrição Realtime para saldo de estrelas E nome
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            if (payload.new.stars !== undefined) setStars(payload.new.stars);
            if (payload.new.full_name) setUserName(payload.new.full_name.split(' ')[0]);
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    setupSubscription();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('stars, full_name').eq('id', user.id).single();
      setStars(data?.stars || 0);
      if (data?.full_name) setUserName(data.full_name.split(' ')[0]);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Desconectar", "Deseja sair do Santuário?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: async () => await supabase.auth.signOut() }
    ]);
  };

  const toggleAudio = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (AudioService && AudioService.toggleMusic) {
      AudioService.toggleMusic(!newMutedState);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
        <View>
          <Text style={styles.welcomeText}>BEM-VINDO AO</Text>
          <Text style={styles.logoText}>EVOLGEIST</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.starBadge}>
          <Ionicons name="sparkles" size={14} color={Colors.accent} />
          <Text style={styles.starCount}>{stars}</Text>
        </View>

        <TouchableOpacity onPress={toggleAudio} style={styles.iconButton}>
          <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={22} color={Colors.accent} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={22} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 15,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 35, height: 35, marginRight: 10, resizeMode: 'contain' },
  welcomeText: { color: '#888', fontSize: 8, fontWeight: 'bold', letterSpacing: 1 },
  logoText: { color: Colors.accent, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  userName: { color: '#FFF', fontSize: 11, opacity: 0.8, marginTop: 2 },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  starCount: { color: '#FFF', marginLeft: 4, fontWeight: 'bold', fontSize: 12 },
  iconButton: { marginLeft: 15 }
});