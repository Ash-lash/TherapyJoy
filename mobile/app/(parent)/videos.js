import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { listVideos } from '../../src/services/firestore';

const FALLBACK_FREE = [
  { id: 'f1', title: 'Calming animations', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=calming+animation+for+kids', premium: false },
  { id: 'f2', title: 'Daily routines song', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=daily+routine+song+kids', premium: false },
];
const FALLBACK_PREMIUM = [
  { id: 'p1', title: 'ABA therapy — Session 1', channel: 'TherapyJoy', url: 'https://www.youtube.com/results?search_query=aba+therapy+session', premium: true },
  { id: 'p2', title: 'Speech exercises for non-verbal kids', channel: 'TherapyJoy', url: 'https://www.youtube.com/results?search_query=speech+exercises+autism', premium: true },
];

export default function Videos() {
  const { profile } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState({ free: FALLBACK_FREE, premium: FALLBACK_PREMIUM });
  const isPremium = profile?.subscription?.status === 'active';

  useEffect(() => {
    (async () => {
      try {
        const all = await listVideos();
        if (all.length) {
          setVideos({
            free: all.filter((v) => !v.premium),
            premium: all.filter((v) => v.premium),
          });
        }
      } catch (e) { console.log(e); }
    })();
  }, []);

  const open = (v) => {
    if (v.premium && !isPremium) {
      Alert.alert('Premium content', 'Upgrade to access therapy videos.', [
        { text: 'Later' },
        { text: 'See plans', onPress: () => router.push('/(parent)/pricing') },
      ]);
      return;
    }
    Linking.openURL(v.url).catch(() => Alert.alert('Could not open'));
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Videos 📺</Text>

      <Card>
        <Text style={theme.font.h3}>Free — YouTube library</Text>
        {videos.free.map((v) => (
          <VideoRow key={v.id} v={v} onPress={() => open(v)} />
        ))}
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={theme.font.h3}>Therapy videos ⭐</Text>
          {!isPremium && <Text style={{ color: theme.colors.accent, fontWeight: '700' }}>Premium</Text>}
        </View>
        {videos.premium.map((v) => (
          <VideoRow key={v.id} v={v} locked={!isPremium} onPress={() => open(v)} />
        ))}
        {!isPremium && (
          <Button title="Upgrade to watch" onPress={() => router.push('/(parent)/pricing')} style={{ marginTop: 10 }} />
        )}
      </Card>
    </Screen>
  );
}

const VideoRow = ({ v, onPress, locked }) => (
  <Pressable onPress={onPress} style={styles.row}>
    <Text style={{ fontSize: 28 }}>{locked ? '🔒' : '▶️'}</Text>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text }}>{v.title}</Text>
      <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>{v.channel}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
});
