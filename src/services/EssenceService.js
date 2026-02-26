export const EssenceService = {
  getDailyEnergies: (userId) => {
    // Usamos a data atual + o ID do usuário para gerar sementes fixas para o dia
    const today = new Date().toISOString().slice(0, 10);
    const seed = today + userId;
    
    // Função simples de hash para gerar números de 0 a 100
    const generateValue = (str, offset) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i) + offset;
      }
      return Math.abs(hash % 100);
    };

    return {
      fisica: generateValue(seed, 10),
      intuitiva: generateValue(seed, 20),
      espiritual: generateValue(seed, 30),
      frequencia: (432 + (generateValue(seed, 40) % 100)).toString() + "Hz"
    };
  }
};