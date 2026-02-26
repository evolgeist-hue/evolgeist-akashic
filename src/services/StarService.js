import { supabase } from './SupabaseService';

export const StarService = {
  async processDailyLogin(userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stars, last_login, current_streak')
      .eq('id', userId)
      .single();

    const today = new Date().toDateString();
    const lastLogin = profile.last_login ? new Date(profile.last_login).toDateString() : null;

    if (today === lastLogin) return { status: 'already_claimed' };

    let newStreak = 1;
    let bonusStars = 1; // 1 estrela diária

    if (lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === yesterday.toDateString()) {
        newStreak = profile.current_streak + 1;
        // Bônus de 7 dias: +3 extras (total 4 com a do dia)
        if (newStreak % 7 === 0) bonusStars += 3;
      }
    }

    const { error } = await supabase.from('profiles').update({
      stars: profile.stars + bonusStars,
      current_streak: newStreak,
      last_login: new Date()
    }).eq('id', userId);

    if (!error) {
      await supabase.from('star_transactions').insert([
        { user_id: userId, amount: bonusStars, description: `Login diário (Streak: ${newStreak})` }
      ]);
    }

    return { status: 'success', starsGained: bonusStars, streak: newStreak };
  }
};