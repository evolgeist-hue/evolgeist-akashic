import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function EnergyPrism({ energies }) {
  const Bar = ({ label, value, color }) => (
    <View style={styles.barWrapper}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.prismTitle}>PRISMA DE HOJE • {energies.frequencia}</Text>
      <Bar label="FÍSICA" value={energies.fisica} color="#FF6B6B" />
      <Bar label="INTUITIVA" value={energies.intuitiva} color={Colors.accent} />
      <Bar label="ESPIRITUAL" value={energies.espiritual} color="#A29BFE" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)' },
  prismTitle: { color: Colors.accent, fontSize: 10, letterSpacing: 2, marginBottom: 20, textAlign: 'center', opacity: 0.8 },
  barWrapper: { marginBottom: 15 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  barLabel: { color: Colors.textSecondary, fontSize: 9, letterSpacing: 1 },
  barValue: { color: Colors.text, fontSize: 10, fontWeight: 'bold' },
  track: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
  fill: { height: '100%', borderRadius: 2 }
});