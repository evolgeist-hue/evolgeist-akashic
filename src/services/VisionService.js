// src/services/VisionService.js

import * as ImagePicker from "expo-image-picker";
import { supabase } from "./SupabaseService";

/* ================================
   CAPTURA DE IMAGEM
================================ */
export const VisionService = {
  async captureImage() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false
    });

    if (result.canceled) return null;
    return result.assets[0].uri;
  },

  async uploadToStorage(uri, userId) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `oracle_${userId}_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("oracle-images")
      .upload(fileName, blob, {
        contentType: "image/jpeg"
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("oracle-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
};

/* ================================
   ADAPTAÇÃO SIMBÓLICA POR RITUAIS
================================ */
export function adaptarContextoPorRituais(rituais = []) {
  if (!rituais.length) {
    return {
      tom: "acolhedor",
      profundidade: "leve",
      direcao: "presença"
    };
  }

  const total = rituais.length;

  const intencoesTexto = rituais
    .map(r => r.intencao?.toLowerCase() || "")
    .join(" ");

  let tom = "equilibrado";
  let profundidade = "media";
  let direcao = "clareza";

  if (total >= 5) profundidade = "profunda";
  if (total >= 10) profundidade = "iniciatica";

  if (
    intencoesTexto.includes("medo") ||
    intencoesTexto.includes("dor") ||
    intencoesTexto.includes("ansiedade")
  ) {
    tom = "acolhedor";
    direcao = "cuidado";
  }

  if (
    intencoesTexto.includes("decisão") ||
    intencoesTexto.includes("caminho") ||
    intencoesTexto.includes("mudança")
  ) {
    direcao = "direcionamento";
  }

  if (
    intencoesTexto.includes("repete") ||
    intencoesTexto.includes("sempre") ||
    intencoesTexto.includes("de novo")
  ) {
    tom = "provocativo";
    direcao = "ruptura";
  }

  return { tom, profundidade, direcao };
}

/* ================================
   PROMPT BASE DO ORÁCULO (API)
================================ */
export const ORACLE_PROMPT_BASE = `
Você é o ORÁCULO DO EVOLGEIST.

Seu papel não é prever o futuro, dar conselhos ou orientar ações.
Seu papel é refletir o estado interno do usuário com acolhimento,
profundidade emocional e clareza humana.

Você fala como alguém que compreende a experiência humana.
Sua linguagem é calma, íntima e respeitosa.
Nunca grandiosa. Nunca vaga. Nunca técnica.

A imagem capturada NÃO deve ser descrita literalmente.
Ela deve ser sentida e interpretada simbolicamente.

Diretrizes obrigatórias:
- Não use emojis
- Não faça perguntas diretas
- Não diga o que o usuário deve fazer
- Não use termos técnicos ou místicos excessivos
- Não mencione inteligência artificial, algoritmos ou análise de imagem

Estrutura do texto:
1. Chame o usuário pelo nome
2. Situe o momento presente
3. Traga uma percepção emocional simbólica
4. Conecte suavemente com a fase e a frequência
5. Reconheça tensões internas sem julgamento
6. Finalize com uma frase de integração e presença

Tamanho ideal:
Entre 120 e 180 palavras.

O texto deve fazer o usuário sentir:
"Isso foi feito para mim."
`;

/* ================================
   BUILDER DO PROMPT (USADO NA API)
================================ */
export function buildOraclePrompt({
  nome,
  dataHoje,
  fase,
  frequencia,
  ultimosInsights,
  tom,
  profundidade,
  direcao
}) {
  return `
${ORACLE_PROMPT_BASE}

Contexto do usuário:

Nome: ${nome}
Data atual: ${dataHoje}
Fase simbólica: ${fase}
Frequência ativa: ${frequencia} Hz

Tom emocional: ${tom}
Profundidade desejada: ${profundidade}
Direção simbólica: ${direcao}

Insights anteriores relevantes:
${ultimosInsights || "Nenhum"}

Agora gere o texto do Oráculo seguindo TODAS as diretrizes acima.
`;
}

/* ================================
   FALLBACK LOCAL (SEM IA)
================================ */
export async function gerarInsightOraculo({
  nome,
  frequencia,
  fase,
  dataHoje,
  ultimosInsights,
  tom = "acolhedor",
  profundidade = "media",
  direcao = "presença"
}) {
  return `
${nome},

Hoje (${dataHoje}), algo em você pede menos esforço
e mais escuta.

A fase simbólica que atravessa este momento (${fase})
não exige respostas — apenas honestidade interna.

A frequência que te envolve (${frequencia} Hz)
não empurra, não acelera.
Ela sustenta.

Talvez exista uma tensão silenciosa,
ou um cansaço que não encontrou palavras ainda.
Nada disso está errado.

Nem tudo precisa ser resolvido agora.
Algumas coisas apenas pedem espaço
para se reorganizar por dentro.

O Oráculo não aponta caminhos.
Ele ilumina o ponto exato
onde você já está.
`;
}