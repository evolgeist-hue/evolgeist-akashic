import { gerarPerfilApometrico } from "../../services/ApometriaService";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

/* ================================
   CONFIGURAÇÃO GLOBAL
================================ */
import { AppConfig } from "../../config/AppConfig";

const { USE_MOCK_DATA } = AppConfig;

/* ================================
   DADOS MOCK (SEM BACKEND)
================================ */
const MOCK_USER = {
  id: "mock-user",
  name: "Viajante",
  full_name: "Viajante Evolgeist",
  stars: 30
};

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(MOCK_USER);

  const [oracleModal, setOracleModal] = useState({
    visible: false,
    image: null,
    insight: ""
  });

  // 👇 Novo useEffect para gerar perfil apométrico
  useEffect(() => {
    const perfil = gerarPerfilApometrico({
      nome: "Teste",
      dataNascimento: "1990-06-15",
      horaNascimento: "08",
      localNascimento: "Brasil"
    });

    console.log("PERFIL APOMÉTRICO:", perfil);
  }, []);

  useEffect(() => {
    initializeHome();
  }, []);

  async function initializeHome() {
    setLoading(true);

    if (USE_MOCK_DATA) {
      setUserData(MOCK_USER);
      setLoading(false);
      return;
    }

    // 🔒 Código real entra aqui no futuro
  }

  async function handleOracleAction() {
    if (USE_MOCK_DATA) {
      setOracleModal({
        visible: true,
        image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986",
        insight:
          "Este é um insight simbólico em modo de preparação.\n\nO Oráculo desperta em breve.\n\nPermaneça presente."
      });
      return;
    }

    // 🔒 Código real entra aqui no futuro
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
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Olá, {userData.name}</Text>

          <View style={styles.headerRight}>
            <View style={styles.starBadge}>
              <Text style={styles.starText}>✨ {userData.stars}</Text>
            </View>
          </View>
        </View>

        {/* TÍTULO */}
        <Text style={styles.title}>EVOLGEIST</Text>

        {/* CARD ORÁCULO */}
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

        {/* CARD RITUAL */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#111" }]}
          onPress={() => {
            if (USE_MOCK_DATA) {
              alert("Funcionalidade em preparação.");
              return;
            }
            navigation.navigate("Ritual");
          }}
        >
          <View style={styles.cardOverlay}>
            <Ionicons name="flame-outline" size={40} color={Colors.accent} />
            <Text style={styles.cardTitle}>RITUAL DIÁRIO</Text>
          </View>
        </TouchableOpacity>

        {/* CARD REGISTRO AKÁSHICO */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#0F1A24" }]}
          onPress={() => navigation.navigate("AkashicChat")}
        >
          <View style={styles.cardOverlay}>
            <Ionicons name="infinite-outline" size={40} color={Colors.accent} />
            <Text style={styles.cardTitle}>REGISTRO AKÁSHICO</Text>
            <Text style={{ color: "#AAA", marginTop: 6, fontSize: 12 }}>
              Acesso consciente à memória da alma
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DO ORÁCULO */}
      <Modal visible={oracleModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {/* IMAGEM DO ORÁCULO */}
              {oracleModal.image && (
                <Image
                  source={{ uri: oracleModal.image }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              )}

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

  modalImage: {
    height: 200,
    marginBottom: 20,
    borderRadius: 20
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