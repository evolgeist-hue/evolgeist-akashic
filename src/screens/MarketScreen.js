import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Colors from '../constants/Colors';

const PACKS = [
  { id: '1', title: 'Centelha', stars: 10, price: 'R$ 4,90', icon: 'flash-outline' },
  { id: '2', title: 'Constelação', stars: 50, price: 'R$ 19,90', icon: 'sparkles-outline' },
  { id: '3', title: 'Galáxia', stars: 200, price: 'R$ 69,90', icon: 'planet-outline' },
];

export default function MarketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* OPÇÃO DE ESTRELAS POR ANÚNCIO */}
        <TouchableOpacity 
          style={styles.adCard} 
          onPress={() => Alert.alert("Evolgeist", "O vídeo está sendo carregado.")}
        >
          <View style={styles.adInfo}>
            <Ionicons name="play-circle" size={40} color={Colors.accent} />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.adTitle}>GANHAR ESTRELAS</Text>
              <Text style={styles.adSub}>Assista um anúncio e receba 5 Estrelas</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>PACOTES DISPONÍVEIS</Text>

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
  adCard: { backgroundColor: 'rgba(212,175,55,0.1)', padding: 20, borderRadius: 25, marginBottom: 30, borderWidth: 1, borderColor: Colors.accent },
  adInfo: { flexDirection: 'row', alignItems: 'center' },
  adTitle: { color: Colors.accent, fontWeight: 'bold', fontSize: 16 },
  adSub: { color: '#CCC', fontSize: 12 },
  sectionTitle: { color: '#555', fontSize: 10, letterSpacing: 2, marginBottom: 20, textAlign: 'center' },
  packCard: { flexDirection: 'row', backgroundColor: Colors.surface, padding: 20, borderRadius: 20, marginBottom: 15, alignItems: 'center', justifyContent: 'space-between' },
  packInfo: { flexDirection: 'row', alignItems: 'center' },
  packTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  packStars: { color: Colors.accent, fontSize: 14 },
  priceBadge: { backgroundColor: Colors.accent, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  priceText: { color: '#000', fontWeight: 'bold' }
});