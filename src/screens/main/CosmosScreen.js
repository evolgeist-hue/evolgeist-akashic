import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, Share } from 'react-native';
import { supabase } from '../../services/SupabaseService';
import { AIService } from '../../services/AIService'; 
import AIModal from '../../components/AIModal';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';

export default function CosmosScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [dailyCount, setDailyCount] = useState(0);
  
  const [modal, setModal] = useState({ visible: false, title: '', content: '', loading: false, isInteractive: false });

  useEffect(() => { loadCosmicData(); }, []);

  async function loadCosmicData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);

      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase.from('readings').select('*', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('type', 'REGISTRO AKÁSHICO').gte('created_at', today);
      setDailyCount(count || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  // 1. MAPA ASTRAL: Automático, Matemático, Sem Interação.
  const generateMapaAstral = async () => {
    if (!profile.birth_date || !profile.birth_time || !profile.birth_place) {
      return Alert.alert("Dados Incompletos", "Atualize sua Data, Hora e Local de nascimento no Perfil.");
    }

    // Trava de 10 estrelas integrada
    if (profile.stars < 10) {
      return Alert.alert("Luz Insuficiente", "O Mapa Astral requer 10 estrelas.");
    }

    Alert.alert("CONEXÃO ESTELAR", "Deseja consumir 10 estrelas para gerar seu Mapa Astral?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", onPress: async () => {
          setModal({ visible: true, title: 'MAPA ASTRAL DE ALTA PRECISÃO', content: '', loading: true, isInteractive: false });
          
          const prompt = `Atue como um sistema astronômico e astrológico de precisão. Calcule o Mapa Astral exato para: Nascimento em ${profile.birth_date} às ${profile.birth_time} na localidade de ${profile.birth_place}. Aplique princípios de mecânica celeste baseados na equação P(t) = L + M + correções para determinar as posições planetárias, signos e casas exatas no momento do nascimento. Não faça perguntas ao usuário. Entregue um relatório completo, direto e profundo.`;
          
          try {
            // Deduz as estrelas e atualiza perfil
            const { error: updateError } = await supabase.from('profiles').update({ stars: profile.stars - 10 }).eq('id', profile.id);
            if (updateError) throw updateError;

            const res = await AIService.getGeminiResponse("MAPA ASTRAL", profile, prompt);
            setModal(prev => ({ ...prev, content: res, loading: false }));
            await supabase.from('readings').insert({ user_id: profile.id, type: 'MAPA ASTRAL', content: res });
            
            // Recarrega o perfil para atualizar o saldo visualmente
            loadCosmicData();
          } catch (e) {
            setModal(prev => ({ ...prev, loading: false }));
            Alert.alert("Erro Astral", "Falha na leitura dos astros.");
          }
      }}
    ]);
  };

  // 2. REGISTRO AKÁSHICO: O Chat Interativo com IA.
  const handleAkashic = () => {
    const cost = dailyCount >= 3 ? 3 : 0;
    
    Alert.alert("REGISTRO AKÁSHICO", cost > 0 ? "Limite de 3 consultas gratuitas atingido. Deseja abrir o portal por 3 estrelas?" : "Iniciar conexão com os Registros (Consulta Gratuita).", [
      { text: "Cancelar", style: "cancel" },
      { text: "Conectar", onPress: async () => {
          if (cost > 0 && profile.stars < 3) return Alert.alert("Luz Insuficiente", "Adquira mais estrelas no Mercado.");
          if (cost > 0) {
            await supabase.from('profiles').update({ stars: profile.stars - 3 }).eq('id', profile.id);
            loadCosmicData();
          }
          setModal({ visible: true, title: 'REGISTRO AKÁSHICO', content: 'As crônicas estão abertas. O que deseja saber?', loading: false, isInteractive: true });
      }}
    ]);
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator color={Colors.accent} size="large" /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <TouchableOpacity style={styles.card} onPress={generateMapaAstral}>
          <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986' }} style={styles.cardBg} imageStyle={{ borderRadius: 20, opacity: 0.4 }}>
            <Text style={styles.cardTitle}>MAPA ASTRAL DE PRECISÃO</Text>
            <Text style={styles.cardSub}>CÁLCULO AUTOMÁTICO DE MECÂNICA CELESTE (10 ⭐)</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleAkashic}>
          <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0' }} style={styles.cardBg} imageStyle={{ borderRadius: 20, opacity: 0.4 }}>
            <Text style={styles.cardTitle}>REGISTRO AKÁSHICO</Text>
            <Text style={styles.cardSub}>CHAT COM A INTELIGÊNCIA ESPIRITUAL</Text>
          </ImageBackground>
        </TouchableOpacity>
      </ScrollView>

      <AIModal 
        visible={modal.visible} 
        onClose={() => setModal({ ...modal, visible: false })} 
        title={modal.title} 
        fullText={modal.content} 
        loading={modal.loading}
        isInteractive={modal.isInteractive}
        onSendQuestion={async (q) => {
          setModal(prev => ({ ...prev, loading: true }));
          const res = await AIService.getGeminiResponse("AKASHICO", profile, q);
          setModal(prev => ({ ...prev, content: res, loading: false }));
        }}
        onShare={() => Share.share({ message: `✨ Evolgeist - ${modal.title} ✨\n\n${modal.content}` })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center' },
  card: { height: 160, marginBottom: 20, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.accent },
  cardBg: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  cardTitle: { color: Colors.accent, fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  cardSub: { color: '#FFF', fontSize: 10, marginTop: 5, opacity: 0.8, textAlign: 'center' }
});