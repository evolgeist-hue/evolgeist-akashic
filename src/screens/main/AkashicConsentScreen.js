import { CONSENT_KEY } from "../../constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";

export default function AkashicConsentScreen({ navigation }) {
  const [checked, setChecked] = useState(false);

  async function acceptConsent() {
    if (!checked) return;
    await AsyncStorage.setItem(CONSENT_KEY, "true");
    navigation.replace("AkashicChat");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CONSENTIMENTO</Text>

      <Text style={styles.text}>
        ⚠️ O Registro Akáshico é uma experiência simbólica e reflexiva.
        {"\n\n"}
        Não substitui orientação médica, psicológica ou espiritual
        profissional.
        {"\n\n"}
        Ao continuar, você declara estar consciente e de acordo.
      </Text>

      <TouchableOpacity
        onPress={() => setChecked(!checked)}
        style={styles.checkbox}
      >
        <Text style={{ color: checked ? Colors.accent : "#888" }}>
          {checked ? "☑ Li e compreendi" : "☐ Li e compreendi"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { opacity: checked ? 1 : 0.4 }
        ]}
        onPress={acceptConsent}
        disabled={!checked}
      >
        <Text style={styles.buttonText}>Prosseguir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A14",
    padding: 30,
    justifyContent: "center"
  },
  title: {
    color: Colors.accent,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20
  },
  text: {
    color: "#DDD",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 30
  },
  checkbox: {
    alignItems: "center",
    marginBottom: 25
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 14,
    borderRadius: 14,
    alignItems: "center"
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold"
  }
});