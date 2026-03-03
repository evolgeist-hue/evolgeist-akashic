import { gerarPerfilApometrico } from "./ApometriaService";

export function criarPerfilAkashico(dadosUsuario) {
  const perfilApometrico = gerarPerfilApometrico(dadosUsuario);

  return {
    identidade: {
      nome: dadosUsuario.nome,
      nascimento: dadosUsuario.dataNascimento,
      signo: calcularSigno(dadosUsuario.dataNascimento)
    },
    apometria: perfilApometrico,
    limites: {
      perguntasGratuitas: 3,
      custoExtra: 5
    },
    termoEtico:
      "Este registro atua como instrumento simbólico de autoconhecimento. Não substitui orientação médica ou psicológica."
  };
}

function calcularSigno(data) {
  const [ano, mes, dia] = data.split("-").map(Number);

  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return "Áries";
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return "Touro";
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return "Gêmeos";
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return "Câncer";
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return "Leão";
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return "Virgem";
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return "Libra";
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return "Escorpião";
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return "Sagitário";
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return "Capricórnio";
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return "Aquário";
  return "Peixes";
}