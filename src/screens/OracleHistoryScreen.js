import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/SupabaseService';
import Colors from '../constants/Colors';

export default function OracleHistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('oracle_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error) setHistory(data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.insight} numberOfLines={3}>"{item.insight_text}"</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GALERIA ORACULAR</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma memória visual capturada ainda.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: Colors.accent, fontSize: 14, fontWeight: 'bold', letterSpacing: 4 },
  list: { padding: 20 },
  card: { backgroundColor: Colors.surface, borderRadius: 20, marginBottom: 20, overflow: 'hidden', flexDirection: 'row', height: 120, borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)' },
  image: { width: 120, height: 120 },
  content: { flex: 1, padding: 15, justifyContent: 'center' },
  date: { color: Colors.accent, fontSize: 10, marginBottom: 5, fontWeight: 'bold' },
  insight: { color: Colors.text, fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', marginTop: 100, letterSpacing: 2 }
});