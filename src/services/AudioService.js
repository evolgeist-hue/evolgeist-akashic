import { Audio } from 'expo-av';

class AudioService {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.playlist = [
      { id: '1', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Substitua por suas URLs de mantras
      { id: '2', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    ];
  }

  async toggleMusic(shouldPlay) {
    if (shouldPlay) {
      if (!this.sound) await this.loadTrack(this.currentTrackIndex);
      await this.sound.playAsync();
      this.isPlaying = true;
    } else {
      if (this.sound) await this.sound.pauseAsync();
      this.isPlaying = false;
    }
  }

  async loadTrack(index) {
    if (this.sound) await this.sound.unloadAsync();
    const { sound } = await Audio.Sound.createAsync(
      { uri: this.playlist[index].uri },
      { shouldPlay: this.isPlaying, isLooping: true }
    );
    this.sound = sound;
    this.currentTrackIndex = index;
  }

  async nextTrack() {
    let next = (this.currentTrackIndex + 1) % this.playlist.length;
    await this.loadTrack(next);
  }

  async prevTrack() {
    let prev = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    await this.loadTrack(prev);
  }
}

export const AudioServiceInstance = new AudioService();