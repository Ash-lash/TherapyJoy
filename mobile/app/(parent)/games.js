import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import { theme } from '../../src/theme';

const GAMES = [
  { id: 'emotion', title: 'Emotion Match', emoji: '😊', desc: 'Recognize feelings from faces', bg: '#FBCFE8' },
  { id: 'color',   title: 'Color Match',   emoji: '🎨', desc: 'Learn colors with fun items',   bg: '#FDE68A' },
  { id: 'pattern', title: 'Pattern Game',  emoji: '🧩', desc: 'Remember and repeat sequences', bg: '#BAE6FD' },
];

export default function Games() {
  const router = useRouter();
  return (
    <Screen>
      <Text style={theme.font.h1}>Games 🎮</Text>
      <Text style={{ color: theme.colors.textMuted }}>Short, calm sessions with progress tracking.</Text>
      {GAMES.map((g) => (
        <Pressable
          key={g.id}
          onPress={() => router.push(`/(parent)/game/${g.id}`)}
          style={({ pressed }) => [styles.card, { backgroundColor: g.bg }, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <Text style={{ fontSize: 54 }}>{g.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{g.title}</Text>
            <Text style={styles.desc}>{g.desc}</Text>
          </View>
          <Text style={{ fontSize: 24 }}>›</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderRadius: theme.radius.lg, ...theme.shadow,
  },
  title: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  desc: { fontSize: 14, color: '#374151', marginTop: 2 },
});
