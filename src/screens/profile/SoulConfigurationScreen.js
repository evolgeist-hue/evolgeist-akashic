import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { supabase } from '../../services/SupabaseService';
import Colors from '../../constants/Colors';

export default function SoulConfigurationScreen({ navigation }) {
  const [birthDate, setBirthDate] = useState(''); // Sugestão: Usar um DatePicker library depois
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [loading, setLoading] = useState(false);

  async function saveSoulData() {
    if (!birthDate || !birthTime || !birthPlace) {
      Alert.alert("Campos Incompletos", "Sua frequência astral precisa de todos os dados para ser calculada.");
      return;
    }

    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase
      .from('profiles')
      .update({
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: birthPlace,
      })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      Alert.alert("Erro", "Não conseguimos sintonizar seus dados. Tente novamente.");
    } else {
      Alert.alert("Sintonizado!", "Seus dados foram gravados na Biblioteca Akáshica.");
      navigation.replace('Home'); // Vai para a Home após preencher
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configuração de Alma</Text>
      <Text style={styles.description}>
        Estes dados são essenciais para gerarmos seu Mapa Astral e acessarmos seus Registros Akáshicos com precisão.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data de Nascimento (AAAA-MM-DD)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="1990-05-20" 
          placeholderTextColor="#666"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <Text style={styles.label}>Horário Exato (HH:MM)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="14:30" 
          placeholderTextColor="#666"
          value={birthTime}
          onChangeText={setBirthTime}
        />

        <Text style={styles.label}>Cidade e País de Nascimento</Text>
        <TextInput 
          style={styles.input} 
          placeholder="São Paulo, Brasil" 
          placeholderTextColor="#666"
          value={birthPlace}
          onChangeText={setBirthPlace}
        />
      </View>

      <TouchableOpacity style={styles.goldButton} onPress={saveSoulData} disabled={loading}>
        <Text style={styles.goldButtonText}>{loading ? "GRAVANDO..." : "SINTONIZAR DESTINO"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 30, paddingTop: 60 },
  title: { fontSize: 28, color: Colors.accent, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  description: { color: Colors.textSecondary, textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  inputGroup: { marginBottom: 30 },
  label: { color: Colors.accent, marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  input: { 
    backgroundColor: Colors.surface, 
    color: Colors.text, 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondary 
  },
  goldButton: { 
    backgroundColor: Colors.accent, 
    padding: 20, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8
  },
  goldButtonText: { color: Colors.background, fontWeight: 'bold', letterSpacing: 2, fontSize: 16 }
});