import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { VoiceService } from '../services/VoiceService';

export default function AIModal({ visible, onClose, title, fullText, loading, onSendQuestion, isInteractive }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [userQuestion, setUserQuestion] = useState('');
  const [showInput, setShowInput] = useState(isInteractive);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!loading && visible && index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [index, visible, loading, fullText]);

  useEffect(() => {
    if (!visible) {
      setDisplayedText('');
      setIndex(0);
      setUserQuestion('');
      setShowInput(isInteractive);
      handleStopVoice(); 
    }
  }, [visible, isInteractive]);

  const handleConsult = () => {
    setShowInput(false);
    onSendQuestion(userQuestion);
  };

  const handleVoice = () => {
    if (isSpeaking) {
      handleStopVoice();
    } else {
      setIsSpeaking(true);
      VoiceService.speak(fullText);
    }
  };

  const handleStopVoice = () => {
    VoiceService.stop();
    setIsSpeaking(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `✨ Revelação Evolgeist ✨\n\n${title}\n\n"${fullText}"\n\nBusque sua luz no Evolgeist.`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.headerActions}>
              {/* Botão de compartilhar restaurado incondicionalmente quando não está carregando e o texto terminou */}
              {!loading && !showInput && index >= fullText.length && (
                <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
                  <Ionicons name="share-social" size={24} color={Colors.accent} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={30} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {showInput ? (
            <View style={styles.inputArea}>
              <Text style={styles.instruction}>O que você deseja perguntar às Crônicas da Alma?</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Qual minha missão vinda de vidas passadas?"
                placeholderTextColor={Colors.textSecondary}
                multiline
                value={userQuestion}
                onChangeText={setUserQuestion}
              />
              <TouchableOpacity style={styles.consultBtn} onPress={handleConsult}>
                <Text style={styles.consultBtnText}>INVOCAR RESPOSTA</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                  <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.accent} />
                    <Text style={styles.loadingText}>Sintonizando as esferas celestes...</Text>
                  </View>
                ) : (
                  <Text style={styles.aiText}>{displayedText}<Text style={styles.cursor}>|</Text></Text>
                )}
              </ScrollView>

              {!loading && index >= fullText.length && (
                <View style={styles.footerActions}>
                  <TouchableOpacity style={styles.voiceBtn} onPress={handleVoice}>
                    <Ionicons name={isSpeaking ? "stop-circle" : "volume-high"} size={24} color={Colors.background} />
                    <Text style={styles.voiceBtnText}>{isSpeaking ? "PARAR VOZ" : "OUVIR PROFECIA"}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Text style={styles.closeBtnText}>GRATIDÃO</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 },
  modalContainer: { height: '80%', backgroundColor: Colors.background, borderRadius: 30, borderWidth: 1, borderColor: Colors.accent, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginRight: 15 },
  title: { color: Colors.accent, fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  inputArea: { flex: 1, justifyContent: 'center' },
  instruction: { color: Colors.text, fontSize: 18, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  textInput: { backgroundColor: Colors.surface, color: Colors.text, borderRadius: 15, padding: 20, height: 150, textAlignVertical: 'top', borderWidth: 1, borderColor: Colors.border },
  consultBtn: { backgroundColor: Colors.accent, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 25 },
  consultBtnText: { color: Colors.background, fontWeight: 'bold', letterSpacing: 1 },
  content: { flexGrow: 1 },
  aiText: { color: Colors.text, fontSize: 17, lineHeight: 26, textAlign: 'justify' },
  cursor: { color: Colors.accent },
  center: { marginTop: 50, alignItems: 'center' },
  loadingText: { color: Colors.textSecondary, marginTop: 20 },
  footerActions: { marginTop: 10 },
  voiceBtn: { backgroundColor: Colors.accent, flexDirection: 'row', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  voiceBtnText: { color: Colors.background, fontWeight: 'bold', marginLeft: 10 },
  closeBtn: { backgroundColor: 'transparent', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.accent },
  closeBtnText: { color: Colors.accent, fontWeight: 'bold' }
});