import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { listenToMessages, sendMessageToParent, getUserProfile } from '../../src/services/firestore';

export default function DoctorMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [parentNames, setParentNames] = useState({});
  const [selectedParent, setSelectedParent] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsub = listenToMessages('doctor', user.uid, async (list) => {
      setMessages(list);
      const uniqueParents = [...new Set(list.map((m) => m.parentUid))];
      const names = {};
      await Promise.all(uniqueParents.map(async (uid) => {
        if (!parentNames[uid]) {
          const p = await getUserProfile(uid);
          names[uid] = p?.name || p?.email || 'Parent';
        }
      }));
      setParentNames((prev) => ({ ...prev, ...names }));
    });
    return unsub;
  }, [user]);

  const threads = [...new Set(messages.map((m) => m.parentUid))];
  const threadMsgs = messages.filter((m) => m.parentUid === selectedParent);

  const send = async () => {
    if (!reply.trim() || !selectedParent) return;
    try {
      await sendMessageToParent(user.uid, selectedParent, reply.trim());
      setReply('');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  if (!selectedParent) {
    return (
      <Screen>
        <Text style={theme.font.h1}>Messages 💬</Text>
        {threads.length === 0 ? (
          <Card><Text style={{ color: theme.colors.textMuted }}>No messages yet.</Text></Card>
        ) : threads.map((uid) => {
          const last = messages.find((m) => m.parentUid === uid);
          return (
            <Pressable key={uid} onPress={() => setSelectedParent(uid)}>
              <Card>
                <Text style={theme.font.h3}>{parentNames[uid] || 'Parent'}</Text>
                <Text style={{ color: theme.colors.textMuted, marginTop: 4 }} numberOfLines={1}>{last?.text}</Text>
              </Card>
            </Pressable>
          );
        })}
      </Screen>
    );
  }

  return (
    <Screen>
      <Button title="← All chats" variant="ghost" onPress={() => setSelectedParent(null)} />
      <Text style={theme.font.h2}>{parentNames[selectedParent] || 'Parent'}</Text>
      <Card>
        {threadMsgs.slice().reverse().map((m) => (
          <View key={m.id} style={[styles.msg, m.fromRole === 'doctor' ? styles.mine : styles.theirs]}>
            <Text>{m.text}</Text>
          </View>
        ))}
      </Card>
      <Input value={reply} onChangeText={setReply} placeholder="Reply…" multiline />
      <Button title="Send" onPress={send} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  msg: { padding: 12, borderRadius: 14, marginVertical: 4, maxWidth: '85%' },
  mine: { backgroundColor: theme.colors.primarySoft, alignSelf: 'flex-end' },
  theirs: { backgroundColor: '#F3F4F6', alignSelf: 'flex-start' },
});
