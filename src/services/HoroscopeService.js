import { AIService } from './AIService';

export const HoroscopeService = {
  async getDailyInsight(userId) {
    // Chamamos o Gemini com a flag 'isFreeInsight = true'
    const result = await AIService.askGemini(
      userId, 
      "Gere meu insight de sabedoria para hoje baseado na minha data de nascimento.", 
      true
    );
    return result.success ? result.answer : "Sua luz brilha intensamente hoje. Siga sua intuição.";
  }
};