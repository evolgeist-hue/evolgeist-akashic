import { supabase } from './SupabaseService';

export const RewardService = {
  async checkAndAwardStar(userId) {
    // Buscando dados atuais do perfil
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('stars, last_checkin, streak_count')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) return { success: false, message: "Erro ao acessar o santuário." };

    const now = new Date();
    const lastCheckin = profile.last_checkin ? new Date(profile.last_checkin) : null;
    
    // Verifica se já passou 24h desde o último check-in
    if (!lastCheckin || (now - lastCheckin) >= 24 * 60 * 60 * 1000) {
      let newStreak = (profile.streak_count || 0) + 1;
      let bonusStars = 1; // Estrela diária padrão

      // Regra de Ouro: 7 dias = +3 estrelas bônus (Total 4)
      if (newStreak === 7) {
        bonusStars = 4; 
        newStreak = 0; // Reinicia o ciclo
      }

      // Se passou de 48h, o usuário perdeu o ritmo e o streak reseta
      if (lastCheckin && (now - lastCheckin) > 48 * 60 * 60 * 1000) {
        newStreak = 1;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          stars: (profile.stars || 0) + bonusStars,
          last_checkin: now.toISOString(),
          streak_count: newStreak
        })
        .eq('id', userId);

      if (updateError) return { success: false, message: "Conexão com as estrelas falhou." };

      return { 
        success: true, 
        newStars: (profile.stars || 0) + bonusStars,
        bonus: bonusStars > 1 
      };
    }

    return { success: false, message: "O universo ainda está processando sua luz diária." };
  }
};