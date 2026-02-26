import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { NewsService } from '../../services/NewsService';
import Colors from '../../constants/Colors';

export default function NewsScreen() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const data = await NewsService.getEvolgeistNews();
    setNews(data);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.portalText}>Fonte: {item.portal}</Text>
        <Text style={styles.linkText}>Ler mais →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CONEXÕES</Text>
        <Text style={styles.subtitle}>Onde o espírito encontra a tecnologia</Text>
      </View>

      <FlatList
        data={news}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.accent, letterSpacing: 3 },
  subtitle: { color: Colors.textSecondary, fontSize: 14 },
  card: { 
    backgroundColor: Colors.surface, 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: Colors.secondary 
  },
  categoryBadge: { 
    alignSelf: 'flex-start', 
    backgroundColor: Colors.primary, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  categoryText: { color: Colors.accent, fontSize: 10, fontWeight: 'bold' },
  cardTitle: { color: Colors.text, fontSize: 18, fontWeight: '600', marginBottom: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  portalText: { color: Colors.textSecondary, fontSize: 12 },
  linkText: { color: Colors.accent, fontWeight: 'bold' }
});