export const ZodiacService = {
  getZodiacData: (dateString) => {
    if (!dateString) return { name: 'Explorador', symbol: '✨' };
    
    // Converte DD/MM/AAAA para dia e mês
    const [day, month] = dateString.split('/').map(Number);

    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return { name: 'Aquário', symbol: '♒' };
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return { name: 'Peixes', symbol: '♓' };
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return { name: 'Áries', symbol: '♈' };
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return { name: 'Touro', symbol: '♉' };
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return { name: 'Gêmeos', symbol: '♊' };
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return { name: 'Câncer', symbol: '♋' };
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return { name: 'Leão', symbol: '♌' };
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return { name: 'Virgem', symbol: '♍' };
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return { name: 'Libra', symbol: '♎' };
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return { name: 'Escorpião', symbol: '♏' };
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return { name: 'Sagitário', symbol: '♐' };
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return { name: 'Capricórnio', symbol: '♑' };
    
    return { name: 'Estrela', symbol: '✨' };
  }
};