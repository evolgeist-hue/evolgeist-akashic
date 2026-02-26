export const NewsService = {
  async getEvolgeistNews() {
    try {
      // Aqui você pode usar uma NewsAPI ou buscar de um RSS específico
      // Por enquanto, simulamos o retorno que integra os dois mundos:
      const mockNews = [
        {
          id: '1',
          title: 'A Convergência entre IA e Consciência',
          portal: 'TechSpirit',
          category: 'IA',
          url: 'https://exemplo.com/ia-consciencia'
        },
        {
          id: '2',
          title: 'Eclipse Solar: O que esperar para esta semana',
          portal: 'Portal Astral',
          category: 'Astrologia',
          url: 'https://exemplo.com/eclipse'
        },
        {
          id: '3',
          title: 'Como a IA está decifrando manuscritos antigos',
          portal: 'Arqueologia Digital',
          category: 'IA',
          url: 'https://exemplo.com/manuscritos'
        }
      ];
      return mockNews;
    } catch (error) {
      console.error("Erro ao carregar portais:", error);
      return [];
    }
  }
};