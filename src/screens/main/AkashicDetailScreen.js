export default function AkashicDetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: '#AAA', marginBottom: 10 }}>
        Pergunta
      </Text>
      <Text style={{ color: '#FFF', marginBottom: 20 }}>
        {item.question}
      </Text>

      <Text style={{ color: '#AAA', marginBottom: 10 }}>
        Resposta do Registro
      </Text>
      <Text style={{ color: '#FFF', lineHeight: 24 }}>
        {item.answer}
      </Text>
    </View>
  );
}