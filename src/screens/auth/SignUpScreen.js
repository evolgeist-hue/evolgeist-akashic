import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/SupabaseService';
import Colors from '../../constants/Colors';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (text) => {
    let cleaned = text.replace(/\D/g, ''); 
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setBirthDate(formatted);
  };

  const handleTimeChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    setBirthTime(formatted);
  };

  const formatDateToDB = (dateStr) => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  async function handleSignUp() {
    if (!email || !password || !fullName || !birthDate || !birthTime || !birthPlace) {
      Alert.alert('Portal Bloqueado', 'Todos os dados são vitais para o seu Mapa Astral.');
      return;
    }

    const dbDate = formatDateToDB(birthDate);
    if (!dbDate) {
      Alert.alert('Data Inválida', 'Use o formato DD/MM/AAAA');
      return;
    }

    setLoading(true);
    
    // 1. Criar usuário no Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      Alert.alert('Erro no Cosmos', authError.message);
      setLoading(false);
      return;
    }

    if (user) {
      // AJUSTE SEGURO: Forçar o login manual para garantir que o token de sessão seja gerado
      // Isso resolve o erro 42501 (RLS) garantindo a autenticação imediata
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (signInError) {
        console.error("Erro ao autenticar sessão:", signInError);
      }

      // Pequeno delay para propagação da sessão no cabeçalho do cliente
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id || user.id;

      const dbTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;

      // 2. Criar Perfil na tabela profiles
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: currentUserId,
          full_name: fullName,
          birth_date: dbDate,
          birth_time: dbTime,
          birth_place: birthPlace,
          stars: 50,
        },
      ]);

      if (profileError) {
        console.error("Erro detalhado Supabase:", profileError);
        Alert.alert('Erro no Perfil', 'O banco recusou os dados. Verifique as permissões (RLS).');
      } else {
        Alert.alert('Iniciado!', 'Sua jornada no Evolgeist começou.', [
          { text: 'OK', onPress: () => navigation.replace('MainTabs') }
        ]);
      }
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../../../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
        <Text style={styles.subtitle}>INICIAÇÃO AO SANTUÁRIO</Text>

        <View style={styles.form}>
          <Text style={styles.label}>NOME COMPLETO</Text>
          <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#555" value={fullName} onChangeText={setFullName} />

          <View style={styles.row}>
            <View style={{ flex: 1.5, marginRight: 10 }}>
              <Text style={styles.label}>DATA (DD/MM/AAAA)</Text>
              <TextInput style={styles.input} placeholder="19/06/1972" placeholderTextColor="#555" value={birthDate} onChangeText={handleDateChange} keyboardType="numeric" maxLength={10} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>HORA (HH:MM)</Text>
              <TextInput style={styles.input} placeholder="14:30" placeholderTextColor="#555" value={birthTime} onChangeText={handleTimeChange} keyboardType="numeric" maxLength={5} />
            </View>
          </View>

          <Text style={styles.label}>LOCAL DE NASCIMENTO (CIDADE/UF)</Text>
          <TextInput style={styles.input} placeholder="Ex: Rio de Janeiro - RJ" placeholderTextColor="#555" value={birthPlace} onChangeText={setBirthPlace} />

          <Text style={styles.label}>E-MAIL</Text>
          <TextInput style={styles.input} placeholder="seu@email.com" autoCapitalize="none" value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>SENHA MESTRA</Text>
          <View style={styles.passwordWrapper}>
            <TextInput style={styles.passwordInput} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 15 }}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.mainBtn} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.mainBtnText}>CRIAR CONTA</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 30, alignItems: 'center', paddingTop: 60 },
  logoImg: { height: 50, width: 200, marginBottom: 10 },
  subtitle: { color: Colors.textSecondary, fontSize: 10, letterSpacing: 3, marginBottom: 40 },
  form: { width: '100%' },
  label: { color: Colors.accent, fontSize: 10, marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: Colors.surface, color: '#FFF', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row' },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 30 },
  passwordInput: { flex: 1, color: '#FFF', padding: 15 },
  mainBtn: { backgroundColor: Colors.accent, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  mainBtnText: { color: Colors.background, fontWeight: 'bold' }
});