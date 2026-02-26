import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Share, ActivityIndicator, SafeAreaView } from 'react-native';
import { supabase } from '../services/SupabaseService';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

export default function HistoryScreen() {
  const [readings, setReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReadings(data || []);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const onShare = async (item) => {
    try {
      await Share.share({
        message: `✨ Revelação Evolgeist ✨\n\nLeitura: ${item.type}\nData: ${new Date(item.created_at).toLocaleDateString()}\n\nInsight: ${item.content}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedReading(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.type}>{item.type.toUpperCase()}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('pt-BR')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.accent} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.headerTitle}>CRÔNICAS DA ALMA</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={readings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma crônica registrada ainda.</Text>}
        />
      )}

      <Modal visible={!!selectedReading} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedReading?.type.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => onShare(selectedReading)}>
                <Ionicons name="share-social-outline" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>{selectedReading?.content}</Text>
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReading(null)}>
              <Text style={styles.closeBtnText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerTitle: { color: Colors.accent, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 20, letterSpacing: 3, marginBottom: 10 },
  card: { backgroundColor: Colors.surface, padding: 20, borderRadius: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)' },
  type: { color: Colors.accent, fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  date: { color: '#888', fontSize: 11 },
  emptyText: { color: '#555', textAlign: 'center', marginTop: 50, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#1A1A2E', borderRadius: 30, padding: 25, height: '80%', borderWidth: 1, borderColor: Colors.accent },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: Colors.accent, fontWeight: 'bold', letterSpacing: 2 },
  modalText: { color: '#FFF', fontSize: 16, lineHeight: 26, textAlign: 'justify' },
  closeBtn: { marginTop: 20, backgroundColor: Colors.accent, padding: 15, borderRadius: 15, alignItems: 'center' },
  closeBtnText: { color: '#000', fontWeight: 'bold' }
});