/* =====================================================
   APOMETRIA SERVICE
   Camada simbólica de auto-observação
   NÃO é diagnóstico, NÃO é terapia
===================================================== */

/**
 * Gera um perfil apométrico simbólico a partir
 * de dados básicos do usuário.
 */
export function gerarPerfilApometrico({
  nome,
  dataNascimento,
  horaNascimento,
  localNascimento
}) {
  return {
    identidade: {
      nome: nome || "Viajante",
      assinatura: gerarAssinaturaSimbolica(dataNascimento)
    },

    campos: {
      eixoPredominante: determinarEixo(dataNascimento),
      campoAtivo: determinarCampoEnergetico(horaNascimento),
      linguagemInterna: determinarLinguagem()
    },

    limitesEticos: {
      aviso:
        "Este processo é simbólico e reflexivo. Não substitui orientação médica, psicológica ou espiritual profissional.",
      consentimentoObrigatorio: true
    },

    metadados: {
      criadoEm: new Date().toISOString(),
      versao: "1.0.0"
    }
  };
}

/* ================================
   FUNÇÕES AUXILIARES (INTERNAS)
================================ */

function gerarAssinaturaSimbolica(data) {
  if (!data) return "Caminhante do Agora";

  const dia = new Date(data).getDate();

  if (dia <= 7) return "Guardião da Origem";
  if (dia <= 14) return "Tecelão de Pontes";
  if (dia <= 21) return "Observador do Meio";
  return "Portador do Fim e do Recomeço";
}

function determinarEixo(data) {
  if (!data) return "Consciência";

  const mes = new Date(data).getMonth() + 1;

  if ([1, 4, 7, 10].includes(mes)) return "Consciência";
  if ([2, 5, 8, 11].includes(mes)) return "Memória";
  return "Propósito";
}

function determinarCampoEnergetico(hora) {
  if (!hora) return "Campo Neutro";

  const h = parseInt(hora, 10);

  if (h >= 5 && h < 12) return "Campo de Ativação";
  if (h >= 12 && h < 18) return "Campo de Expansão";
  if (h >= 18 && h < 23) return "Campo de Integração";
  return "Campo de Silêncio";
}

function determinarLinguagem() {
  const linguagens = [
    "Intuitiva",
    "Simbólica",
    "Imagética",
    "Reflexiva"
  ];

  return linguagens[Math.floor(Math.random() * linguagens.length)];
}