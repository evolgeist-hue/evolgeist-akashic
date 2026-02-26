import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

export const SensoryManager = {
  // Vibração leve para navegação
  triggerSoft: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  
  // Vibração forte para quando ganha a Estrela (Sucesso)
  triggerSuccess: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  // Som de cura (Frequência 432Hz ou Taça Tibetana)
  playAmbient: async () => {
    const { sound } = await Audio.Sound.createAsync(
       { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Substituir por um loop de meditação
       { shouldPlay: true, isLooping: true, volume: 0.2 }
    );
    return sound;
  }
};