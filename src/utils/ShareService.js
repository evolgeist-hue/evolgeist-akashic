import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { SensoryManager } from './SensoryManager';

export const ShareService = {
  async shareAkashicCard(viewRef) {
    try {
      SensoryManager.triggerSoft();
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1.0,
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Partilhe o seu Destino Akáshico',
      });
    } catch (error) {
      console.error("Erro ao partilhar:", error);
    }
  }
};