import * as Speech from 'expo-speech';

export const VoiceService = {
  speak: (text) => {
    const options = {
      language: 'pt-BR',
      pitch: 0.85, // Um tom levemente mais grave para soar mais solene/místico
      rate: 0.9,   // Uma fala um pouco mais lenta e pausada
    };

    Speech.speak(text, options);
  },

  stop: () => {
    Speech.stop();
  }
};