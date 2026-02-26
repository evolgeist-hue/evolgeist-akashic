// src/screens/main/RitualScreen.js

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity
} from "react-native";

import Colors from "../../constants/Colors";
import { calcularFaseSimbolica } from "../../services/PhaseService";
import { calcularFrequenciaDinamica } from "../../services/FrequencyService";
import { supabase } from "../../services/SupabaseService";

export default function RitualScreen({ navigation }) {
  const [intencao, setIntencao] = useState("");
  const [duracao, setDuracao] = useState(5);
  const [ritualIniciado, setRitualIniciado] = useState(false);

  const [verificando, setVerificando] = useState(true);
  const [ritualDisponivel, setRitualDisponivel] = useState(true);

  const timerRef = useRef(null);

  const faseSimbolica = calcularFaseSimbolica();

  const frequenciaAtual = calcularFrequenciaDinamica({
    frequenciaBase: 432,
    faseSimbolica,
    horaAtual: new Date().getHours(),
    nivelInteracao: 1
  });

  // 🔒 Verifica se o ritual do dia já foi realizado
  useEffect(() => {
    verificarRitualDiario();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function verificarRitualDiario() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from("ritual_history")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", hoje.toISOString())
      .limit(1);

    if (data && data.length > 0) {
      setRitualDisponivel(false);
    }

    setVerificando(false);
  }

  async function registrarRitual() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("ritual_history").insert({
      user_id: user.id,
      intencao,
      duracao,
      fase: faseSimbolica,
      frequencia: frequenciaAtual
    });
  }

  function iniciarRitual() {
    setRitualIniciado(true);

    timerRef.current = setTimeout(() => {
      encerrarRitual();
    }, duracao * 60 * 1000);
  }

  async function encerrarRitual() {
    if (timerRef.current) clearTimeout(timerRef.current);

    await registrarRitual();
    setRitualIniciado(false);
    navigation.goBack();
  }

  // ⏳ Estado de verificação
  if (verificando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.ritualArea}>
          <Text style={styles.subtitle}>
            Alinhando o tempo simbólico...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🔐 Ritual já realizado hoje
  if (!ritualDisponivel) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.ritualArea}>
          <Text style={styles.title}>RITUAL REALIZADO</Text>

          <Text style={styles.ritualTextSmall}>
            O alinhamento de hoje já aconteceu.
          </Text>

          <Text style={styles.ritualTextSmall}>
            Permita que ele se integre antes de retornar.
          </Text>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.endText}>RETORNAR</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 🌒 Ritual disponível
  return (
    <SafeAreaView style={styles.container}>
      {!ritualIniciado ? (
        <>
          <Text style={styles.title}>RITUAL DIÁRIO</Text>

          <Text style={styles.subtitle}>
            Este é um momento de alinhamento consciente.
          </Text>

          <Text style={styles.label}>Intenção</Text>
          <TextInput
            style={styles.input}
            placeholder="O que pede presença em você hoje?"
            placeholderTextColor="#666"
            value={intencao}
            onChangeText={setIntencao}
            multiline
          />

          <Text style={styles.label}>Duração</Text>
          <View style={styles.durationRow}>
            {[5, 10, 15].map((min) => (
              <TouchableOpacity
                key={min}
                style={[
                  styles.durationBtn,
                  duracao === min && styles.durationBtnActive
                ]}
                onPress={() => setDuracao(min)}
              >
                <Text
                  style={[
                    styles.durationText,
                    duracao === min && { color: "#000" }
                  ]}
                >
                  {min} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.startBtn,
              !intencao && { opacity: 0.4 }
            ]}
            onPress={iniciarRitual}
            disabled={!intencao}
          >
            <Text style={styles.startText}>INICIAR</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.ritualArea}>
          <Text style={styles.ritualPhase}>{faseSimbolica}</Text>

          <Text style={styles.ritualFreq}>
            Frequência ativa: {frequenciaAtual} Hz
          </Text>

          <Text style={styles.ritualText}>
            Permaneça presente.
          </Text>

          <Text style={styles.ritualTextSmall}>
            Não force. Não busque. Apenas sustente.
          </Text>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={encerrarRitual}
          >
            <Text style={styles.endText}>ENCERRAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A14",
    padding: 25
  },

  title: {
    color: Colors.accent,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 4
  },

  subtitle: {
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 14
  },

  label: {
    color: "#888",
    marginBottom: 5
  },

  input: {
    backgroundColor: "#111",
    color: "#FFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 25,
    minHeight: 70
  },

  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35
  },

  durationBtn: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 12,
    width: "30%",
    alignItems: "center"
  },

  durationBtnActive: {
    backgroundColor: Colors.accent
  },

  durationText: {
    color: "#FFF",
    fontWeight: "bold"
  },

  startBtn: {
    backgroundColor: Colors.accent,
    padding: 18,
    borderRadius: 20,
    alignItems: "center"
  },

  startText: {
    color: "#000",
    fontWeight: "bold",
    letterSpacing: 2
  },

  ritualArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  ritualPhase: {
    color: "#666",
    letterSpacing: 3,
    marginBottom: 10
  },

  ritualFreq: {
    color: Colors.accent,
    fontSize: 18,
    marginBottom: 20
  },

  ritualText: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 6
  },

  ritualTextSmall: {
    color: "#AAA",
    fontSize: 14,
    marginBottom: 40,
    textAlign: "center"
  },

  endBtn: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30
  },

  endText: {
    color: Colors.accent,
    letterSpacing: 2
  }
});