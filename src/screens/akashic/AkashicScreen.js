import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { supabase } from '../../services/SupabaseService';
import { AstrologyEngine } from '../../utils/AstrologyEngine';
import { VoiceService } from '../../services/VoiceService';
import { ShareService } from '../../utils/ShareService';
import { SensoryManager } from '../../utils/SensoryManager';
import MainBackground from '../../components/MainBackground';
import { ViralCard } from '../../components/ViralCard';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function AkashicScreen() {
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const viewShotRef = useRef();

  useEffect(() => {
    loadAkashicData();
    // Para a voz se o usuário sair da tela
    return () => VoiceService.stop();
  }, []);

  async function loadAkashicData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('birth_date, birth_time, birth_place, full_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name || 'Iniciado');
        const calculated = await AstrologyEngine.calculateChart(
          profile.birth_date,
          profile.birth_time,
          profile.birth_place
        );
        setChart(calculated);
      }
    } catch (err) {
      console.error("Erro ao acessar registros:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleListen = () => {
    if (!chart) return;
    const textToRead = `Saudações, ${userName}. Seus registros indicam um Sol em ${chart.sun}, com Lua em ${chart.moon}. Seu ascendente em ${chart.rising} revela que sua alma busca a transcendência através do equilíbrio entre o espírito e a matéria. Este é o seu momento de despertar.`;
    VoiceService.speak(textToRead);
  };

  const handleShare = async () => {
    await ShareService.shareAkashicCard(viewShotRef);
  };

  if (loading) {
    return (
      <MainBackground>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>ACESSANDO BIBLIOTECA ETERNA...</Text>
        </View>
      </MainBackground>
    );
  }

  return (
    <MainBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>REGISTRO AKÁSHICO</Text>
        <Text style={styles.subtitle}>A assinatura da sua alma no universo</Text>

        {/* Cards de Informação Astral */}
        <View style={styles.chartContainer}>
          <View style={styles.glassCard}>
            <Text style={styles.cardLabel}>ESSÊNCIA SOLAR</Text>
            <Text style={styles.cardValue}>{chart?.sun}</Text>
          </View>

          <View style={styles.glassCard}>
            <Text style={styles.cardLabel}>CORPO EMOCIONAL (LUA)</Text>
            <Text style={styles.cardValue}>{chart?.moon}</Text>
          </View>

          <View style={styles.glassCard}>
            <Text style={styles.cardLabel}>PROPÓSITO (ASCENDENTE)</Text>
            <Text style={styles.cardValue}>{chart?.rising}</Text>
          </View>
        </View>

        {/* Bloco de Mensagem do Guardião */}
        <View style={styles.messageBox}>
          <Text style={styles.messageTitle}>Nota do Guardião</Text>
          <Text style={styles.messageText}>
            Seus registros estão agora sintonizados. Você pode usar estas informações para fazer perguntas complexas ao Oráculo e entender como estas energias influenciam seu presente.
          </Text>
        </View>

        {/* Ações Imersivas */}
        <TouchableOpacity style={styles.voiceButton} onPress={handleListen}>
          <Text style={styles.voiceButtonText}>🔊 OUVIR REVELAÇÃO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>✨ PARTILHAR NO STORY</Text>
        </TouchableOpacity>

        {/* Componente Invisível para Geração da Imagem Viral */}
        <ViralCard ref={viewShotRef} chart={chart} userName={userName} />
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </MainBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 60,
    alignItems: 'center',
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.accent,
    marginTop: 20,
    letterSpacing: 3,
    fontSize: 12,
  },
  headerTitle: {
    color: Colors.accent,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  chartContainer: {
    width: '100%',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  cardLabel: {
    color: Colors.accent,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 5,
  },
  cardValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  messageBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderStyle: 'dashed',
    width: '100%',
  },
  messageTitle: {
    color: Colors.accent,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageText: {
    color: Colors.textSecondary,
    lineHeight: 22,
    fontSize: 14,
  },
  voiceButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent,
    padding: 18,
    borderRadius: 30,
    marginTop: 40,
    alignItems: 'center',
  },
  voiceButtonText: {
    color: Colors.accent,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  shareButton: {
    width: '100%',
    backgroundColor: Colors.accent,
    padding: 18,
    borderRadius: 30,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  shareButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});