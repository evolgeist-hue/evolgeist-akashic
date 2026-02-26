import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { supabase } from '../../services/SupabaseService';
import Colors from '../../constants/Colors';
import * as Haptics from 'expo-haptics';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    // ADICIONADO: Vibração ao clicar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Erro no Portal", error.message);
      setLoading(false);
    } else {
      setLoading(false);
      navigation.replace('Main'); 
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inner}>
        
        {/* ALTERADO: Sai o texto <Text>, entra a <Image> */}
        <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
        
        <Text style={styles.subtitle}>Sintonize sua frequência espiritual</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Seu E-mail Estelar"
            placeholderTextColor={Colors.textSecondary}
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            autoCapitalize={'none'}
          />
          <TextInput
            placeholder="Sua Chave Privada (Senha)"
            placeholderTextColor={Colors.textSecondary}
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={signInWithEmail}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "CONECTANDO..." : "ENTRAR NO SANTUÁRIO"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerText}>Ainda não possui um registro? <Text style={{color: Colors.accent}}>Criar conta</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, justifyContent: 'center', padding: 30, alignItems: 'center' },
  // ESTILO DO LOGO: Centralizado e proporcional
  logoImage: { width: 160, height: 160, marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 40, textAlign: 'center' },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border
  },
  button: { width: '100%', backgroundColor: Colors.accent, padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: Colors.background, fontWeight: 'bold', letterSpacing: 2 },
  footerText: { color: Colors.textSecondary, marginTop: 25 }
});