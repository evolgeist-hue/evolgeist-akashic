import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import Colors from '../../constants/Colors';

const PACKS = [
  { id: '1', amount: 50, price: 'R$ 9,90', label: 'Centelha' },
  { id: '2', amount: 100, price: 'R$ 17,90', label: 'Constelação' },
  { id: '3', amount: 500, price: 'R$ 69,90', label: 'Galáxia', bestValue: true },
];

export default function StoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MERCADO ESTELAR</Text>
      <Text style={styles.subtitle}>Adquira energia para suas consultas profundas</Text>

      <FlatList
        data={PACKS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.packCard, item.bestValue && styles.bestValueCard]}>
            <View>
              <Text style={styles.packLabel}>{item.label}</Text>
              <Text style={styles.packAmount}>✨ {item.amount} Estrelas</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 25 },
  title: { color: Colors.accent, fontSize: 24, fontWeight: 'bold', marginTop: 50, textAlign: 'center' },
  subtitle: { color: Colors.textSecondary, textAlign: 'center', marginBottom: 30 },
  packCard: { 
    backgroundColor: Colors.surface, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.secondary
  },
  bestValueCard: { borderColor: Colors.accent, borderWidth: 2 },
  packLabel: { color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase' },
  packAmount: { color: Colors.text, fontSize: 20, fontWeight: 'bold' },
  priceBadge: { backgroundColor: Colors.accent, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  priceText: { color: Colors.background, fontWeight: 'bold' }
});