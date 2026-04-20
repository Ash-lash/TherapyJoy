import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { getWeeklyProgress, getMoodHistory } from '../../src/services/firestore';

const moodEmoji = { happy: '😊', calm: '😌', sad: '😢', angry: '😠' };

export default function Progress() {
  const { user } = useAuth();
  const [weekly, setWeekly] = useState({ completedGames: 0, averageStars: 0, totalScore: 0, days: [] });
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setWeekly(await getWeeklyProgress(user.uid));
      setMoods(await getMoodHistory(user.uid, 14));
    })();
  }, [user]);

  const maxScore = Math.max(1, ...weekly.days.map((d) => d.totalScore || 0));

  return (
    <Screen>
      <Text style={theme.font.h1}>Progress 📈</Text>

      <Card>
        <Text style={theme.font.h3}>Last 7 days</Text>
        <View style={styles.stats}>
          <Stat value={weekly.completedGames} label="Games" />
          <Stat value={weekly.averageStars} label="Avg stars" />
          <Stat value={weekly.totalScore} label="Score" />
        </View>
        <View style={styles.chart}>
          {weekly.days.slice().reverse().map((d) => (
            <View key={d.id} style={styles.barCol}>
              <View style={[styles.bar, { height: 10 + ((d.totalScore || 0) / maxScore) * 120 }]} />
              <Text style={styles.barLabel}>{d.id.slice(5)}</Text>
            </View>
          ))}
          {weekly.days.length === 0 && (
            <Text style={{ color: theme.colors.textMuted }}>No games played yet this week.</Text>
          )}
        </View>
      </Card>

      <Card>
        <Text style={theme.font.h3}>Mood log</Text>
        <View style={styles.moodGrid}>
          {moods.length === 0 && <Text style={{ color: theme.colors.textMuted }}>No mood entries yet.</Text>}
          {moods.map((m) => (
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
  stats: { flexDirection: 'row', marginTop: 10, marginBottom: 16 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, gap: 6 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: '70%', backgroundColor: theme.colors.primary, borderRadius: 8 },
  barLabel: { fontSize: 10, color: theme.colors.textMuted, marginTop: 4 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  moodChip: {
    backgroundColor: theme.colors.primarySoft, padding: 8, borderRadius: 12,
    alignItems: 'center', minWidth: 56,
  },
});
