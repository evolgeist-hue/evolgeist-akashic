import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

export const ViralCard = React.forwardRef(({ chart, userName }, ref) => {
  return (
    <View ref={ref} collapsable={false} style={styles.cardContainer}>
      <LinearGradient colors={Colors.backgroundGradient} style={styles.gradient}>
        <View style={styles.borderInner}>
          <Text style={styles.appName}>EVOLGEIST</Text>
          
          <View style={styles.content}>
            <Text style={styles.userTitle}>{userName}</Text>
            <Text style={styles.revelationTitle}>A Minha Assinatura Astral</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>SOL</Text>
              <Text style={styles.value}>{chart?.sun}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>LUA</Text>
              <Text style={styles.value}>{chart?.moon}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>ASCENDENTE</Text>
              <Text style={styles.value}>{chart?.rising}</Text>
            </View>
          </View>

          <Text style={styles.footerText}>Descubra o seu propósito no Evolgeist</Text>
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: { width: 360, height: 640, position: 'absolute', left: -1000 }, // Fora da tela
  gradient: { flex: 1, padding: 20 },
  borderInner: { flex: 1, borderWidth: 2, borderColor: Colors.accent, borderRadius: 20, padding: 30, alignItems: 'center', justifyContent: 'space-between' },
  appName: { color: Colors.accent, fontSize: 24, fontWeight: 'bold', letterSpacing: 8 },
  content: { width: '100%', alignItems: 'center' },
  userTitle: { color: Colors.text, fontSize: 22, marginBottom: 5 },
  revelationTitle: { color: Colors.accent, fontSize: 14, marginBottom: 40, letterSpacing: 2 },
  row: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 0.5, borderBottomColor: Colors.goldBorder, paddingBottom: 5 },
  label: { color: Colors.textSecondary, fontSize: 12 },
  value: { color: Colors.text, fontSize: 18, fontWeight: 'bold' },
  footerText: { color: Colors.accent, fontSize: 10, letterSpacing: 1 }
});