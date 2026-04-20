import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '../../../src/components/Screen';
import Button from '../../../src/components/Button';
import EmotionGame from '../../../src/games/EmotionGame';
import ColorGame from '../../../src/games/ColorGame';
import PatternGame from '../../../src/games/PatternGame';
import { theme } from '../../../src/theme';

export default function GameHost() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [key, setKey] = useState(0);

  const games = { emotion: EmotionGame, color: ColorGame, pattern: PatternGame };
  const GameComp = games[id];

  if (!GameComp) {
    return (
      <Screen>
        <Text style={theme.font.h2}>Game not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (result) {
    return (
      <Screen>
        <View style={styles.resultWrap}>
          <Text style={{ fontSize: 80 }}>{'⭐'.repeat(result.stars)}</Text>
          <Text style={theme.font.h1}>Great session!</Text>
          <Text style={{ fontSize: 20, color: theme.colors.textMuted }}>
            Score: {result.score} / {result.total}
          </Text>
        </View>
        <Button title="Play again" onPress={() => { setResult(null); setKey((k) => k + 1); }} />
        <Button title="Back to games" variant="outline" onPress={() => router.replace('/(parent)/games')} />
      </Screen>
    );
  }

  return (
    <Screen padded={false} scroll={false}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.primary }}>← Back</Text>
      </Pressable>
      <GameComp key={key} onDone={setResult} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { padding: 16 },
  resultWrap: { alignItems: 'center', gap: 10, paddingVertical: 30 },
});
