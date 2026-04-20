import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '../../../src/components/Screen';
import Card from '../../../src/components/Card';
import Button from '../../../src/components/Button';
import { theme } from '../../../src/theme';
import { getUserProfile, getWeeklyProgress, getMoodHistory } from '../../../src/services/firestore';

const moodEmoji = { happy: '😊', calm: '😌', sad: '😢', angry: '😠' };

export default function PatientDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [parent, setParent] = useState(null);
  const [weekly, setWeekly] = useState({ completedGames: 0, averageStars: 0, totalScore: 0, days: [] });
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    (async () => {
      setParent(await getUserProfile(id));
      setWeekly(await getWeeklyProgress(id));
      setMoods(await getMoodHistory(id, 14));
    })();
  }, [id]);

  return (
    <Screen>
      <Button title="← Back" variant="ghost" onPress={() => router.back()} />
      {parent && (
        <Card>
          <Text style={theme.font.h1}>{parent.childName || 'Child'}</Text>
          <Text style={{ color: theme.colors.textMuted }}>Parent: {parent.name} · {parent.email}</Text>
          {parent.childAge ? <Text>Age: {parent.childAge}</Text> : null}
          {parent.notes ? (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: '700' }}>Notes:</Text>
              <Text>{parent.notes}</Text>
            </View>
          ) : null}
        </Card>
      )}

      <Card>
        <Text style={theme.font.h3}>Game progress (7d)</Text>
        <View style={styles.stats}>
          <Stat value={weekly.completedGames} label="Games" />
          <Stat value={weekly.averageStars} label="Avg stars" />
          <Stat value={weekly.totalScore} label="Total score" />
        </View>
      </Card>

      <Card>
        <Text style={theme.font.h3}>Mood (14d)</Text>
        <View style={styles.moodGrid}>
          {moods.length === 0 ? (
            <Text style={{ color: theme.colors.textMuted }}>No entries.</Text>
          ) : moods.map((m) => (
            <View key={m.id} style={styles.moodChip}>
              <Text style={{ fontSize: 24 }}>{moodEmoji[m.mood] || '🙂'}</Text>
              <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>{m.date.slice(5)}</Text>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const Stat = ({ value, label }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ fontSize: 26, fontWeight: '800', color: theme.colors.primary }}>{value}</Text>
    <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', marginTop: 10 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  moodChip: { backgroundColor: theme.colors.primarySoft, padding: 8, borderRadius: 12, alignItems: 'center', minWidth: 56 },
});
