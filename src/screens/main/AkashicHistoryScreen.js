import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default function AkashicHistoryScreen({ route }) {
  const history = route?.params?.history ?? [];

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          📜 Nenhum registro encontrado ainda.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>

          <Text style={styles.label}>Pergunta</Text>
          <Text style={styles.question}>{item.question}</Text>

          <Text style={styles.label}>Resposta</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  card: {
    backgroundColor: "#1A1A2E",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16
  },
  date: {
    color: Colors.accent,
    fontSize: 12,
    marginBottom: 10
  },
  label: {
    color: "#AAA",
    fontSize: 12,
    marginTop: 8
  },
  question: {
    color: "#FFF",
    fontSize: 15,
    marginTop: 2
  },
  answer: {
    color: "#DDD",
    fontSize: 15,
    marginTop: 2,
    lineHeight: 22
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#0A0A14",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
    textAlign: "center"
  }
});