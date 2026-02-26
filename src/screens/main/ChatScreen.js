import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/SupabaseService';
import Colors from '../../constants/Colors';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
  }

  // FUNÇÃO PARA PERGUNTA COMPLEXA (Gasta 3 estrelas)
  async function askComplexQuestion() {
    if (inputText.trim() === '') {
      Alert.alert('Vazio', 'Escreva sua dúvida profunda antes de invocar o Guardião.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('stars, full_name, zodiac_sign')
      .eq('id', user.id)
      .single();

    if (profile.stars < 3) {
      Alert.alert('Energia Insuficiente', 'Precisas de pelo menos 3 estrelas para uma consulta profunda. Visite o Mercado!');
      return;
    }

    // Deduz as 3 estrelas
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stars: profile.stars - 3 })
      .eq('id', user.id);

    if (!updateError) {
      const name = profile.full_name?.split(' ')[0] || 'Viajante';
      const userMsg = { user_id: user.id, text: `[CONSULTA PROFUNDA]: ${inputText}`, is_ai: false };
      await supabase.from('chat_messages').insert([userMsg]);
      
      setInputText('');
      fetchMessages();

      setTimeout(() => {
        const response = `${name}, as crônicas de ${profile.zodiac_sign} se abrem. Em resposta à tua busca profunda: "Onde vês obstáculos, o Cosmos vê preparo. Tua essência não é o que conquistas, mas o que emanas."`;
        sendAiResponse(user.id, name, profile.zodiac_sign, response);
      }, 1500);
    }
  }

  async function sendMessage() {
    if (inputText.trim() === '') return;

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, zodiac_sign')
      .eq('id', user.id)
      .single();

    const newMessage = { user_id: user.id, text: inputText, is_ai: false };
    const { error } = await supabase.from('chat_messages').insert([newMessage]);
    
    if (!error) {
      const name = profile?.full_name?.split(' ')[0] || 'Viajante';
      const sign = profile?.zodiac_sign || 'Estrela';
      setInputText('');
      fetchMessages();
      setTimeout(() => sendAiResponse(user.id, name, sign), 1000);
    }
  }

  async function sendAiResponse(userId, name, sign, customText = null) {
    const responses = [
      `Saudações, ${name}. As correntes de ${sign} revelam que o véu entre o que desejas e o que és está mais fino hoje.`,
      `Viajante de ${sign}, os Registros Akáshicos vibram com a tua presença. A luz dourada requer paciência.`,
      `${name}, a constelação de ${sign} guarda segredos que apenas a calma pode decifrar.`
    ];

    const finalMsg = customText || responses[Math.floor(Math.random() * responses.length)];

    await supabase.from('chat_messages').insert([{ 
      user_id: userId, 
      text: finalMsg, 
      is_ai: true 
    }]);
    fetchMessages();
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
    >
      <Text style={styles.header}>REGISTOS AKASHIC</Text>
      
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.msgBubble, item.is_ai ? styles.aiBubble : styles.userBubble]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.premiumHeader}>
        <TouchableOpacity style={styles.premiumBtn} onPress={askComplexQuestion}>
          <Ionicons name="star" size={14} color={Colors.background} />
          <Text style={styles.premiumBtnText}>PERGUNTA COMPLEXA (3 ⭐)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          value={inputText} 
          onChangeText={setInputText} 
          placeholder="Pergunta ao Cosmos..." 
          placeholderTextColor="#666"
          multiline={false} 
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>➔</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  header: { color: Colors.accent, textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, marginBottom: 20 },
  msgBubble: { padding: 15, borderRadius: 20, marginVertical: 5, marginHorizontal: 15, maxWidth: '80%' },
  userBubble: { backgroundColor: Colors.surface, alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: 'rgba(212, 175, 55, 0.1)', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: Colors.accent },
  msgText: { color: Colors.text, fontSize: 15 },
  
  premiumHeader: { alignItems: 'center', paddingBottom: 10, backgroundColor: Colors.background },
  premiumBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  premiumBtnText: { color: Colors.background, fontSize: 11, fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },

  inputContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    backgroundColor: Colors.background, 
    borderTopWidth: 1, 
    borderTopColor: Colors.border 
  },
  input: { flex: 1, backgroundColor: Colors.surface, borderRadius: 25, paddingHorizontal: 20, color: Colors.text, height: 45 },
  sendBtn: { marginLeft: 10, width: 45, height: 45, borderRadius: 22.5, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: Colors.background, fontSize: 20, fontWeight: 'bold' }
});