import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Modal
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

import { supabase } from "../../services/SupabaseService";
import {
  VisionService,
  gerarInsightOraculo,
  adaptarContextoPorRituais
} from "../../services/VisionService";

import { calcularFaseSimbolica } from "../../services/PhaseService";
import { calcularFrequenciaDinamica } from "../../services/FrequencyService";

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    full_name: "",
    stars: 0
  });

  const [oracleModal, setOracleModal] = useState({
    visible: false,
    image: null,
    insight: ""
  });

  useEffect(() => {
    initializeHome();
  }, []);

  async function initializeHome() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      setUserData({
        id: user.id,
        name: profile.full_name?.split(" ")[0] || "Viajante",
        full_name: profile.full_name,
        stars: profile.stars || 0
      });
    }

    setLoading(false);
  }

  async function handleOracleAction() {
    if (userData.stars < 10) {
      return Alert.alert(
        "Estrelas insuficientes",
        "Você precisa de 10 estrelas."
      );
    }

    const imageUri = await VisionService.captureImage();
    if (!imageUri) return;

    setLoading(true);

    try {
      // 🔮 Histórico do Oráculo
      const { data: historicoDB } = await supabase
        .from("oracle_history")
        .select("insight_text")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false })
        .limit(3);

      const ultimosInsights =
        historicoDB?.map(h => h.insight_text).join("\n\n") || "";

      // 🔥 Rituais recentes
      const { data: rituaisRecentes } = await supabase
        .from("ritual_logs")
        .select("intencao")
        .eq("user_id", userData.id)
        .order("performed_at", { ascending: false })
        .limit(7);

      const contextoRitual = adaptarContextoPorRituais(rituaisRecentes || []);

      // 📷 Upload da imagem
      const publicUrl = await VisionService.uploadToStorage(
        imageUri,
        userData.id
      );

      // 🌀 Frequência e fase
      const faseSimbolica = calcularFaseSimbolica();
      const frequenciaAtual = calcularFrequenciaDinamica({
        frequenciaBase: 432,
        faseSimbolica,
        horaAtual: new Date().getHours(),
        nivelInteracao: 1
      });

      // 🧠 Insight
      const insight = await gerarInsightOraculo({
        nome: userData.full_name,
        frequencia: frequenciaAtual,
        fase: faseSimbolica,
        dataHoje: new Date().toLocaleDateString(),
        ultimosInsights,
        ...contextoRitual
      });

      // 💾 Persistência
      await supabase.from("oracle_history").insert({
        user_id: userData.id,
        image_url: publicUrl,
        insight_text: insight
      });

      await supabase
        .from("profiles")
        .update({ stars: userData.stars - 10 })
        .eq("id", userData.id);

      setUserData(prev => ({
        ...prev,
        stars: prev.stars - 10
      }));

      setOracleModal({
        visible: true,
        image: publicUrl,
        insight
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha na conexão simbólica.");
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingArea}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Olá, {userData.name}</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate("OracleHistory")}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="journal-outline"
                size={24}
                color={Colors.accent}
              />
            </TouchableOpacity>

            <View style={styles.starBadge}>
              <Text style={styles.starText}>✨ {userData.stars}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>EVOLGEIST</Text>

        <TouchableOpacity style={styles.card} onPress={handleOracleAction}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986"
            }}
            style={styles.cardBg}
            imageStyle={{ borderRadius: 25 }}
          >
            <View style={styles.cardOverlay}>
              <Ionicons name="eye-outline" size={40} color={Colors.accent} />
              <Text style={styles.cardTitle}>ORÁCULO VISUAL</Text>
              <View style={styles.price}>
                <Text style={styles.priceText}>10 ESTRELAS</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#111" }]}
          onPress={() => navigation.navigate("Ritual")}
        >
          <View style={styles.cardOverlay}>
            <Ionicons name="flame-outline" size={40} color={Colors.accent} />
            <Text style={styles.cardTitle}>RITUAL DIÁRIO</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={oracleModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {oracleModal.image && (
              <ImageBackground
                source={{ uri: oracleModal.image }}
                style={styles.preview}
                imageStyle={{ borderRadius: 15 }}
              />
            )}

            <ScrollView>
              <Text style={styles.insight}>{oracleModal.insight}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() =>
                setOracleModal({ ...oracleModal, visible: false })
              }
            >
              <Text style={{ color: "#000", fontWeight: "bold" }}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ================================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A14" },
  loadingArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  welcome: { color: "#AAA", fontSize: 16 },

  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },

  starBadge: {
    backgroundColor: "rgba(212,175,55,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },

  starText: {
    color: Colors.accent,
    fontWeight: "bold"
  },

  title: {
    color: Colors.accent,
    fontSize: 28,
    textAlign: "center",
    marginVertical: 25,
    letterSpacing: 6,
    fontWeight: "bold"
  },

  card: {
    height: 180,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20
  },

  cardBg: { flex: 1 },

  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center"
  },

  cardTitle: {
    color: Colors.accent,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10
  },

  price: {
    backgroundColor: Colors.accent,
    padding: 6,
    borderRadius: 10,
    marginTop: 10
  },

  priceText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold"
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    padding: 25
  },

  modalContent: {
    backgroundColor: "#1A1A2E",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.accent
  },

  preview: {
    width: "100%",
    height: 200,
    marginBottom: 15
  },

  insight: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20
  },

  closeBtn: {
    backgroundColor: Colors.accent,
    padding: 15,
    borderRadius: 15,
    alignItems: "center"
  }
});