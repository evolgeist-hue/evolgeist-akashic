import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
  ScrollView, Image, TextInput, Alert, SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/SupabaseService';
import { AudioService } from '../../services/AudioService';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import { decode } from 'base64-arraybuffer'; 

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    avatar_url: null
  });
  const [email, setEmail] = useState('');

  useEffect(() => { 
    getProfile(); 
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    } catch (e) {
      console.error("Erro ao buscar perfil:", e);
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true, 
      });

      if (!result.canceled) {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        // Nome de arquivo fixo por usuário para sobrescrever e não encher o storage
        const filePath = `${user.id}/avatar.png`;
        const base64Str = result.assets[0].base64;

        // 1. Upload para o Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, decode(base64Str), {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // 2. Pegar a URL pública
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Adicionamos um timestamp para forçar o app a atualizar a imagem (cache bust)
        const publicUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

        // 3. SALVAR NO BANCO DE DADOS (Isso impede que a foto suma ao deslogar)
        const { error: updateError } = await supabase.from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        setProfile({ ...profile, avatar_url: publicUrl });
        Alert.alert("Sucesso", "Foto salva permanentemente!");
      }
    } catch (e) {
      Alert.alert("Erro", "Verifique as permissões do Bucket 'avatars' no Supabase.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          birth_date: profile.birth_date,
          birth_time: profile.birth_time,
          birth_place: profile.birth_place,
        })
        .eq('id', user.id);

      if (error) throw error;
      Alert.alert("Sucesso", "Dados salvos!");
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlay = async () => {
    try {
      const playing = await AudioService.togglePlay();
      setIsPlaying(playing);
    } catch (error) {
      console.log("Audio promise handled.");
    }
  };

  const handleSkip = (direction) => {
    if (AudioService?.skip) {
      AudioService.skip(direction);
    }
  };

  if (loading && !profile.full_name) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.avatarSection} onPress={pickImage}>
          <View style={styles.avatarCircle}>
            {profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person" size={40} color={Colors.accent} />
            )}
          </View>
          <Text style={styles.changePhotoText}>ALTERAR FOTO DA GALERIA</Text>
        </TouchableOpacity>

        <View style={styles.audioControlsCard}>
          <Text style={styles.audioLabel}>FREQUÊNCIAS BINAURAIS</Text>
          <View style={styles.audioButtons}>
            <TouchableOpacity onPress={() => handleSkip('prev')}>
              <Ionicons name="play-back" size={35} color={Colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playPauseBtn} onPress={handleTogglePlay}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSkip('next')}>
              <Ionicons name="play-forward" size={35} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>E-MAIL DE ACESSO</Text>
          <TextInput style={[styles.input, { opacity: 0.6 }]} value={email} editable={false} color="#FFF" />
          <Text style={styles.inputLabel}>NOME CELESTIAL</Text>
          <TextInput style={styles.input} value={profile.full_name} onChangeText={(v) => setProfile({...profile, full_name: v})} color="#FFF" />
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.inputLabel}>NASCIMENTO</Text>
              <TextInput style={styles.input} value={profile.birth_date} onChangeText={(v) => setProfile({...profile, birth_date: v})} placeholder="AAAA-MM-DD" placeholderTextColor="#666" color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>HORA</Text>
              <TextInput style={styles.input} value={profile.birth_time} onChangeText={(v) => setProfile({...profile, birth_time: v})} placeholder="00:00" placeholderTextColor="#666" color="#FFF" />
            </View>
          </View>

          <Text style={styles.inputLabel}>LOCAL DE ORIGEM</Text>
          <TextInput style={styles.input} value={profile.birth_place} onChangeText={(v) => setProfile({...profile, birth_place: v})} color="#FFF" />

          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => supabase.auth.signOut()}>
          <Text style={styles.logoutText}>ENCERRAR SESSÃO</Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 25 },
  avatarCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: Colors.accent, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  changePhotoText: { color: Colors.accent, fontSize: 10, marginTop: 10, letterSpacing: 1 },
  audioControlsCard: { backgroundColor: Colors.surface, padding: 20, borderRadius: 25, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)' },
  audioLabel: { color: Colors.accent, fontSize: 10, textAlign: 'center', marginBottom: 20, letterSpacing: 2 },
  audioButtons: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40 },
  playPauseBtn: { backgroundColor: Colors.accent, width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  form: { width: '100%' },
  inputLabel: { color: Colors.accent, fontSize: 10, marginBottom: 8, marginTop: 15, letterSpacing: 1 },
  input: { backgroundColor: Colors.surface, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: { marginTop: 30, borderWidth: 1, borderColor: Colors.accent, padding: 18, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: Colors.accent, fontWeight: 'bold', fontSize: 14 },
  logoutButton: { marginTop: 40, padding: 10, alignItems: 'center' },
  logoutText: { color: '#FF4444', fontWeight: 'bold', fontSize: 12, letterSpacing: 2 }
});