// src/services/PhaseService.js

export function calcularFaseSimbolica() {
  const hora = new Date().getHours();
  const dia = new Date().getDay(); // 0 = domingo, 6 = sábado

  // Regras simples e humanas (por enquanto)
  if (hora >= 0 && hora < 6) {
    return "Silêncio";
  }

  if (hora >= 6 && hora < 12) {
    return "Despertar";
  }

  if (hora >= 12 && hora < 18) {
    return "Expansão";
  }

  if (hora >= 18 && hora < 22) {
    return "Integração";
  }

  return "Recolhimento";
}