import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '../../services/SupabaseService';
import Colors from '../../constants/Colors';

export default function NewsScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('cosmos_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setMessages(data);
    setLoading(false);
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MENSAGENS DO COSMOS</Text>
      
      {loading && !refreshing ? (
        <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMessages(); }} tintColor={Colors.accent} />
          }
          renderItem={({ item }) => (
            <View style={styles.newsCard}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category?.toUpperCase() || 'GERAL'}</Text>
              </View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDesc}>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma mensagem captada no momento...</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, paddingTop: 60 },
  header: { color: Colors.accent, fontSize: 20, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', letterSpacing: 2 },
  newsCard: { backgroundColor: Colors.surface, padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: Colors.border },
  categoryBadge: { backgroundColor: 'rgba(212, 175, 55, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginBottom: 10 },
  categoryText: { color: Colors.accent, fontSize: 10, fontWeight: 'bold' },
  newsTitle: { color: Colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  newsDesc: { color: Colors.textSecondary, fontSize: 15, lineHeight: 22 },
  empty: { color: Colors.textSecondary, textAlign: 'center', marginTop: 50 }
});