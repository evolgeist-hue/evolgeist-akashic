import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';

const PACKS = [
  { id: '1', title: 'Centelha', stars: 10, price: 'R$ 4,90', icon: 'flash-outline' },
  { id: '2', title: 'Constelação', stars: 50, price: 'R$ 19,90', icon: 'sparkles-outline' },
  { id: '3', title: 'Galáxia', stars: 200, price: 'R$ 69,90', icon: 'planet-outline' },
];

export default function StoreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>MERCADO ESTELAR</Text>
        <Text style={styles.subtitle}>Adquira estrelas para realizar consultas profundas com os oráculos.</Text>

        {PACKS.map((pack) => (
          <TouchableOpacity key={pack.id} style={styles.packCard}>
            <View style={styles.packInfo}>
              <Ionicons name={pack.icon} size={30} color={Colors.accent} />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.packTitle}>{pack.title}</Text>
                <Text style={styles.packStars}>{pack.stars} Estrelas</Text>
              </View>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{pack.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  title: { color: Colors.accent, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: 30, marginTop: 10, fontSize: 14 },
  packCard: { 
    flexDirection: 'row', 
    backgroundColor: Colors.surface, 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 15, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)'
  },
  packInfo: { flexDirection: 'row', alignItems: 'center' },
  packTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  packStars: { color: Colors.accent, fontSize: 14 },
  priceBadge: { backgroundColor: Colors.accent, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  priceText: { color: '#000', fontWeight: 'bold' }
});