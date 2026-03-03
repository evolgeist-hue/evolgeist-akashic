import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "@akashic_history_";

export async function salvarRegistro(userId, registro) {
  const key = PREFIX + userId;

  const atual = await obterHistorico(userId);

  const atualizado = [
    {
      ...registro,
      data: new Date().toISOString()
    },
    ...atual
  ];

  await AsyncStorage.setItem(key, JSON.stringify(atualizado));
}

export async function obterHistorico(userId) {
  const key = PREFIX + userId;
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export async function limparHistorico(userId) {
  const key = PREFIX + userId;
  await AsyncStorage.removeItem(key);
}