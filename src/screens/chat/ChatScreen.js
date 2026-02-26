import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { AIService } from '../../services/AIService';
import { supabase } from '../../services/SupabaseService';
import Colors from '../../constants/Colors';

export default function ChatScreen() {
  const [messages, setMessages] = useState([{ id: '1', text: "Saudações. Eu sou o Guardião Akáshico. Qual mistério deseja desvendar?", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;
    const response = await AIService.askComplexQuestion(user.id, input);

    if (response.success) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response.answer, sender: 'ai' }]);
    } else {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response.message, sender: 'system' }]);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ORÁCULO AKÁSHICO</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, item.sender === 'user' ? {color: '#000'} : {color: '#fff'}]}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Faça sua pergunta complexa..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
          <Text style={styles.sendIcon}>✨</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.secondary },
  headerTitle: { color: Colors.accent, fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  messageBubble: { padding: 15, borderRadius: 20, marginBottom: 15, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: Colors.accent, borderBottomRightRadius: 2 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: Colors.surface, borderBottomLeftRadius: 2, borderLeftWidth: 3, borderLeftColor: Colors.accent },
  messageText: { fontSize: 16, lineHeight: 22 },
  inputArea: { flexDirection: 'row', padding: 20, paddingBottom: 40, backgroundColor: Colors.surface },
  input: { flex: 1, backgroundColor: Colors.background, color: Colors.text, borderRadius: 25, paddingHorizontal: 20, marginRight: 10, borderWidth: 1, borderColor: Colors.secondary },
  sendButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.accent }
});