import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { theme } from '../../src/theme';
import { saveMood, getMoodHistory, getWeeklyProgress } from '../../src/services/firestore';
import { useRouter } from 'expo-router';
import TopBar from '../../src/components/TopBar';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
];

export default function ParentHome() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [todayMood, setTodayMood] = useState(null);
  const [weekly, setWeekly] = useState({ completedGames: 0, averageStars: 0, totalScore: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const moods = await getMoodHistory(user.uid, 1);
      const today = new Date().toISOString().slice(0, 10);
      const t = moods.find((m) => m.date === today);
      if (t) setTodayMood(t.mood);
      const w = await getWeeklyProgress(user.uid);
      setWeekly(w);
    })();
  }, [user]);

  const pickMood = async (mood) => {
    try {
      await saveMood(user.uid, mood);
      setTodayMood(mood);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const childName = profile?.childName || 'your child';

  return (
    <Screen>
      <TopBar subtitle={`Hello, ${profile?.name || 'Parent'}`} title={`How is ${childName} today?`} />

      <Card>
        <Text style={theme.font.h3}>Daily mood check-in</Text>
        <Text style={{ color: theme.colors.textMuted, marginTop: 4 }}>
          Tap the feeling that best describes today.
        </Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => pickMood(m.id)}
              style={[styles.moodCard, todayMood === m.id && styles.moodCardActive]}
            >
              <Text style={{ fontSize: 36 }}>{m.emoji}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.text }}>{m.label}</Text>
            </Pressable>
          ))}
        </View>
        {todayMood && (
          <Text style={{ marginTop: 10, color: theme.colors.success, fontWeight: '600' }}>
            ✓ Logged for today
          </Text>
        )}
      </Card>

      <Card>
        <Text style={theme.font.h3}>This week</Text>
        <View style={styles.statsRow}>
          <Stat label="Games" value={weekly.completedGames} />
          <Stat label="Avg stars" value={weekly.averageStars} />
          <Stat label="Score" value={weekly.totalScore} />
        </View>
      </Card>

      <Button title="🎮 Start a game" onPress={() => router.push('/(parent)/games')} />
      <Button title="💬 Contact doctor" variant="ghost" onPress={() => router.push('/(parent)/doctor')} />
    </Screen>
  );
}

const Stat = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  moodRow: { flexDirection: 'row', gap: 10, marginTop: 12, justifyContent: 'space-between' },
  moodCard: {
    flex: 1, padding: 12, alignItems: 'center', gap: 4,
    backgroundColor: theme.colors.primarySoft, borderRadius: theme.radius.md,
    borderWidth: 2, borderColor: 'transparent',
  },
  moodCardActive: { borderColor: theme.colors.primary, backgroundColor: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 26, fontWeight: '800', color: theme.colors.primary },
  statLabel: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
});
