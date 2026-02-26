import { supabase } from './SupabaseService';

export const AIService = {
  // 1. GERAÇÃO DE LEITURA (MANTIDO ORIGINAL)
  generate: async (params) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const functionUrl = 'https://angtaeexbexxbpjvebhe.supabase.co/functions/v1/generate';

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na consulta');
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error("Erro capturado no AIService:", error);
      return { 
        text: "Os astros estão em silêncio agora. Verifique sua conexão ou saldo de estrelas.",
        error: true 
      };
    }
  },

  // 2. CÁLCULO DA FREQUÊNCIA ANÍMICA (PARA A HOME)
  calculateSoulFrequency: (name, birthDate) => {
    if (!name || !birthDate) return "432Hz";
    const combined = name + birthDate.replace(/-/g, "");
    let sum = 0;
    for (let i = 0; i < combined.length; i++) {
      sum += combined.charCodeAt(i);
    }
    return `${(sum % 531) + 432}Hz`;
  },

  // 3. FORMATADOR DE DATA (PARA O PERFIL)
  formatBirthDate: (isoDate) => {
    if (!isoDate) return "---";
    try {
      const [year, month, day] = isoDate.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return isoDate;
    }
  }
};