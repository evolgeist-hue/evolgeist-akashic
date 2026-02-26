import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ActivityIndicator, 
  ScrollView, Animated, TouchableOpacity, Alert, 
  ImageBackground, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/SupabaseService';
import { VisionService } from '../../services/VisionService';
import { AIService } from '../../services/AIService';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [oracleModal, setOracleModal] = useState({ visible: false, image: null, insight: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { 
    initializeHome(); 
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  async function initializeHome() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setUserData(profile);
        }
      }
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  const handleOracleAction = async () => {
    setLoading(true);
    try {
      const result = await VisionService.getDailyInsight();
      setOracleModal({ visible: true, image: result.image, insight: result.text });
    } catch (error) {
      Alert.alert("Aviso", "A conexão com o oráculo falhou.");
    } finally { setLoading(false); }
  };

  if (loading && !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          
          {/* FREQUÊNCIA ANÍMICA */}
          <View style={styles.frequencyBox}>
            <Text style={styles.frequencyLabel}>SUA FREQUÊNCIA ANÍMICA</Text>
            <Text style={styles.frequencyValue}>
              {userData?.full_name ? AIService.calculateSoulFrequency(userData.full_name, userData.birth_date) : "---Hz"}
            </Text>
          </View>

          {/* CARD DE INSIGHT / HORÓSCOPO DO DIA */}
          <TouchableOpacity style={styles.oracleCard} onPress={handleOracleAction}>
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1515940175183-6798529cb860?q=80&w=500' }} 
              style={styles.cardBg} 
              imageStyle={{ borderRadius: 20, opacity: 0.6 }}
            >
              <View style={styles.cardOverlay}>
                <Ionicons name="sparkles-outline" size={32} color={Colors.accent} />
                <Text style={styles.cardTitle}>INSIGHT DO DIA</Text>
                <Text style={styles.cardSub}>Toque para receber sua orientação estelar</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <View style={styles.cardContainer}>
            <Text style={styles.sectionLabel}>ORÁCULOS DISPONÍVEIS</Text>

            {/* COSMOS */}
            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('Cosmos')}>
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1537420327992-d6a19f8ecf30?q=80&w=500' }} 
                style={styles.cardBg} 
                imageStyle={{ borderRadius: 25, opacity: 0.5 }}
              >
                <View style={styles.cardOverlay}>
                  <Ionicons name="planet-outline" size={40} color={Colors.accent} />
                  <Text style={styles.cardTitle}>COSMOS</Text>
                  <View style={styles.priceTag}><Text style={styles.priceTagText}>MAPA & AKÁSHICO</Text></View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* CRÔNICAS DA ALMA (HISTÓRICO) */}
            <TouchableOpacity style={[styles.featureCard, { marginTop: 20 }]} onPress={() => navigation.navigate('Histórico')}>
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cb?q=80&w=500' }} 
                style={styles.cardBg} 
                imageStyle={{ borderRadius: 25, opacity: 0.6 }}
              >
                <View style={styles.cardOverlay}>
                  <Ionicons name="book-outline" size={40} color={Colors.accent} />
                  <Text style={styles.cardTitle}>CRÔNICAS DA ALMA</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* MODAL DO INSIGHT */}
      <Modal visible={oracleModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ImageBackground source={{ uri: oracleModal.image }} style={styles.modalImage} imageStyle={{ borderRadius: 20 }}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setOracleModal({ ...oracleModal, visible: false })}>
                <Ionicons name="close" size={30} color="#FFF" />
              </TouchableOpacity>
            </ImageBackground>
            <ScrollView style={{ maxHeight: 200, marginTop: 15 }}>
                <Text style={styles.modalText}>{oracleModal.insight}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  frequencyBox: { alignItems: 'center', marginBottom: 25 },
  frequencyLabel: { color: '#888', fontSize: 10, letterSpacing: 2, marginBottom: 5 },
  frequencyValue: { color: Colors.accent, fontSize: 32, fontWeight: 'bold' },
  oracleCard: { height: 140, borderRadius: 20, overflow: 'hidden', marginBottom: 30 },
  cardContainer: { marginTop: 10 },
  sectionLabel: { color: '#555', fontSize: 10, letterSpacing: 2, marginBottom: 15 },
  featureCard: { height: 160, borderRadius: 25, overflow: 'hidden' },
  cardBg: { flex: 1, width: '100%', height: '100%' }, // AJUSTE: Garante preenchimento total
  cardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 15 },
  cardTitle: { color: Colors.accent, fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  cardSub: { color: '#CCC', fontSize: 12, textAlign: 'center', marginTop: 5 },
  priceTag: { backgroundColor: Colors.accent, padding: 6, borderRadius: 10, marginTop: 10 },
  priceTagText: { color: '#000', fontWeight: 'bold', fontSize: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 30 },
  modalContent: { backgroundColor: '#1A1A2E', borderRadius: 20, padding: 20 },
  modalImage: { width: '100%', height: 250 },
  closeBtn: { alignSelf: 'flex-end', padding: 10 },
  modalText: { color: '#FFF', textAlign: 'center', lineHeight: 22, fontSize: 16 }
});