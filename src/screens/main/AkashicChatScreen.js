import { askAkashic } from ".../../../services/akashicAI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal
} from "react-native";

import Colors from "../../constants/Colors";

/* ================================
   CONFIGURAÇÕES
================================ */
const MAX_DAILY_QUESTIONS = 3;
const CHAT_KEY = "@akashic_chat_messages";
const HISTORY_KEY = "@akashic_history";
const CONSENT_KEY = "@akashic_consent_accepted";

/* ================================
   COMPONENT
================================ */
export default function AkashicChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      from: "akashic",
      text:
        "✨ Bem-vindo ao Registro Akáshico.\n\nVocê pode fazer até 3 perguntas por dia.\n\nFaça sua pergunta com intenção."
    }
  ]);

  const [input, setInput] = useState("");
  const [questionsUsed, setQuestionsUsed] = useState(0);

  const [paywallVisible, setPaywallVisible] = useState(false);
  const [consentVisible, setConsentVisible] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [akashicHistory, setAkashicHistory] = useState([]);

  const scrollRef = useRef(null);

  /* ================================
     INIT
  ================================ */
  useEffect(() => {
    async function init() {
      await resetIfNewDay();
      await loadDailyState();
      await loadMessages();
      await loadHistory();
      await checkConsent();
    }
    init();
  }, []);

  /* ================================
     STORAGE
  ================================ */
  async function loadMessages() {
    const saved = await AsyncStorage.getItem(CHAT_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }

  async function loadHistory() {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    if (stored) setAkashicHistory(JSON.parse(stored));
  }

  async function loadDailyState() {
    const stored = await AsyncStorage.getItem("QUESTIONS_USED");
    if (stored) setQuestionsUsed(Number(stored));
  }

  async function resetIfNewDay() {
    const today = new Date().toDateString();
    const lastDay = await AsyncStorage.getItem("LAST_ACCESS_DAY");

    if (lastDay !== today) {
      await AsyncStorage.setItem("LAST_ACCESS_DAY", today);
      await AsyncStorage.setItem("QUESTIONS_USED", "0");
      setQuestionsUsed(0);
    }
  }

  useEffect(() => {
    AsyncStorage.setItem("QUESTIONS_USED", questionsUsed.toString());
  }, [questionsUsed]);

  useEffect(() => {
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(akashicHistory));
  }, [akashicHistory]);

  /* ================================
     CONSENTIMENTO
  ================================ */
  async function checkConsent() {
    const consent = await AsyncStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setConsentVisible(true);
      setConsentAccepted(false);
    } else {
      setConsentAccepted(true);
    }
  }

  /* ================================
     VOZ
  ================================ */
  function speakAkashic(text) {
    if (!voiceEnabled) return;

    setIsSpeaking(true);
    Speech.speak(text, {
      language: "pt-BR",
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  }

  /* ================================
     ENVIO DE PERGUNTA
  ================================ */
  async function sendQuestion() {
    if (!consentAccepted) {
      setConsentVisible(true);
      return;
    }

    if (questionsUsed >= MAX_DAILY_QUESTIONS) {
      setPaywallVisible(true);
      return;
    }

    if (!input.trim()) return;

    const timestamp = new Date().toISOString();
    const userQuestion = input;

    const akashicResponse = await askAkashic(userQuestion);

    const newMessages = [
      ...messages,
      { from: "user", text: userQuestion, createdAt: timestamp },
      { from: "akashic", text: akashicResponse, createdAt: timestamp }
    ];

    setMessages(newMessages);
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(newMessages));

    setQuestionsUsed(prev => prev + 1);
    setInput("");

    setAkashicHistory(prev => [
      {
        id: Date.now().toString(),
        question: userQuestion,
        answer: akashicResponse,
        createdAt: timestamp
      },
      ...prev
    ]);

    speakAkashic(akashicResponse);
  }

  /* ================================
     UI
  ================================ */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRO AKÁSHICO</Text>

      <TouchableOpacity onPress={() => setVoiceEnabled(!voiceEnabled)}>
        <Text style={styles.voiceToggle}>
          {voiceEnabled ? "🔊 Voz ativa" : "🔇 Voz desativada"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() =>
          navigation.navigate("AkashicHistory", { history: akashicHistory })
        }
      >
        <Text style={styles.historyText}>📜 Ver histórico</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        style={styles.chatBox}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message, index) => (
          <View key={index} style={styles.messageBlock}>
            <Text
              style={{
                color: message.from === "user" ? "#AAA" : "#FFF",
                fontSize: 16
              }}
            >
              {message.text}
            </Text>

            {message.from === "akashic" && (
              <TouchableOpacity
                style={styles.speakerBtn}
                onPress={() => speakAkashic(message.text)}
              >
                <Ionicons
                  name={isSpeaking ? "volume-high" : "volume-medium-outline"}
                  size={20}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          placeholder="Digite sua pergunta..."
          placeholderTextColor="#666"
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendQuestion}>
          <Ionicons name="send" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* MODAL CONSENTIMENTO */}
      <Modal visible={consentVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.accent} />
            <Text style={styles.modalTitle}>Aviso Importante</Text>
            <Text style={styles.modalText}>
              O Registro Akáshico é uma experiência simbólica e reflexiva.
              {"\n\n"}
              Não substitui orientação médica, psicológica ou espiritual.
              {"\n\n"}
              Ao prosseguir, você declara estar ciente e de acordo.
            </Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={async () => {
                await AsyncStorage.setItem(CONSENT_KEY, "true");
                setConsentAccepted(true);
                setConsentVisible(false);
              }}
            >
              <Text style={{ color: Colors.accent }}>
                Aceito e desejo prosseguir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL LIMITE */}
      <Modal visible={paywallVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="star-outline" size={48} color={Colors.accent} />
            <Text style={styles.modalTitle}>Limite Diário Alcançado</Text>
            <Text style={styles.modalText}>
              O Registro respeita pausas.{"\n"}
              Retorne amanhã para novas perguntas.
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setPaywallVisible(false)}
            >
              <Text style={{ color: Colors.accent }}>Compreender</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A14", padding: 20 },
  title: {
    color: Colors.accent,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10
  },
  voiceToggle: { color: Colors.accent, textAlign: "center", marginBottom: 10 },
  historyBtn: { alignSelf: "center", marginBottom: 15 },
  historyText: { color: Colors.accent, fontSize: 16 },
  chatBox: { flex: 1, marginVertical: 20 },
  messageBlock: { marginBottom: 12 },
  speakerBtn: { marginTop: 8, alignSelf: "flex-end" },
  inputArea: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 12,
    color: "#FFF",
    marginRight: 10
  },
  sendBtn: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 12
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 30
  },
  modalContent: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 25,
    alignItems: "center"
  },
  modalTitle: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center"
  },
  modalText: {
    color: "#DDD",
    textAlign: "center",
    marginVertical: 15,
    lineHeight: 22
  },
  closeBtn: {
    borderColor: Colors.accent,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15
  }
});