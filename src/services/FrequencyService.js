// src/services/FrequencyService.js

export function calcularFrequenciaDinamica({
  frequenciaBase,
  faseSimbolica,
  horaAtual,
  nivelInteracao
}) {
  let frequenciaFinal = frequenciaBase;

  // 1️⃣ Ajuste pela fase simbólica
  if (faseSimbolica === "Silêncio") {
    frequenciaFinal -= 2;
  }

  if (faseSimbolica === "Despertar") {
    frequenciaFinal += 1;
  }

  if (faseSimbolica === "Expansão") {
    frequenciaFinal += 3;
  }

  if (faseSimbolica === "Integração") {
    frequenciaFinal += 0.5;
  }

  if (faseSimbolica === "Recolhimento") {
    frequenciaFinal -= 1;
  }

  // 2️⃣ Ajuste pelo horário
  if (horaAtual >= 0 && horaAtual < 6) {
    frequenciaFinal -= 1;
  }

  if (horaAtual >= 6 && horaAtual < 12) {
    frequenciaFinal += 0.5;
  }

  if (horaAtual >= 18) {
    frequenciaFinal -= 0.5;
  }

  // 3️⃣ Ajuste pela interação do usuário
  // (quanto mais ele usa, mais está "sintonizado")
  frequenciaFinal += nivelInteracao * 0.3;

  // 4️⃣ Garantia de segurança (não fica negativo)
  if (frequenciaFinal < 1) {
    frequenciaFinal = 1;
  }

  // Limita para 2 casas decimais
  return Number(frequenciaFinal.toFixed(2));
}