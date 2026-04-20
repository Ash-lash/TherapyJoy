import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { listVideos, addVideo } from '../../src/services/firestore';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [url, setUrl] = useState('');
  const [premium, setPremium] = useState(false);

  const load = async () => { setVideos(await listVideos()); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title || !url) return Alert.alert('Missing', 'Title and URL required.');
    try {
      await addVideo({ title, channel, url, premium });
      setTitle(''); setChannel(''); setUrl(''); setPremium(false);
      load();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Videos 📺</Text>

      <Card>
        <Text style={theme.font.h3}>Add video</Text>
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Input label="Channel / source" value={channel} onChangeText={setChannel} />
        <Input label="URL" value={url} onChangeText={setUrl} placeholder="https://…" />
        <Pressable onPress={() => setPremium(!premium)} style={styles.toggle}>
          <Text style={{ fontSize: 22 }}>{premium ? '✅' : '⬜'}</Text>
          <Text style={{ fontWeight: '700' }}>Premium content</Text>
        </Pressable>
        <Button title="Add" onPress={add} style={{ marginTop: 10 }} />
      </Card>

      <Card>
        <Text style={theme.font.h3}>All videos ({videos.length})</Text>
        {videos.length === 0 && <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>None yet.</Text>}
        {videos.map((v) => (
          <View key={v.id} style={styles.videoRow}>
            <Text style={{ fontSize: 22 }}>{v.premium ? '⭐' : '▶️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700' }}>{v.title}</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>{v.channel}</Text>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  videoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
});
