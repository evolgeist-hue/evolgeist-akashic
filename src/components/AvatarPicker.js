import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';

const MISTIC_AVATARS = [
  { id: '1', url: 'https://cdn-icons-png.flaticon.com/512/3659/3659813.png' }, // Ex: Lua
  { id: '2', url: 'https://cdn-icons-png.flaticon.com/512/3659/3659828.png' }, // Ex: Sol
  { id: '3', url: 'https://cdn-icons-png.flaticon.com/512/3659/3659795.png' }, // Ex: Olho
];

export default function AvatarPicker({ onSelect, currentAvatar }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>ESCOLHA SUA ESSÊNCIA VISUAL</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {MISTIC_AVATARS.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => onSelect(item.url)}
            style={[
              styles.avatarOption, 
              currentAvatar === item.url && styles.selected
            ]}
          >
            <Image source={{ uri: item.url }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  label: { color: Colors.accent, fontSize: 10, letterSpacing: 2, marginBottom: 15, textAlign: 'center' },
  avatarOption: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: Colors.surface, 
    marginHorizontal: 10, 
    borderWidth: 1, 
    borderColor: 'transparent',
    padding: 5
  },
  selected: { borderColor: Colors.accent, backgroundColor: 'rgba(212,175,55,0.2)' },
  image: { width: '100%', height: '100%', borderRadius: 25 }
});