import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { listUsersByRole, sendMessageToDoctor, listenToMessages, getUserProfile } from '../../src/services/firestore';

export default function ContactDoctor() {
  const { user, profile } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(profile?.assignedDoctorUid || null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await listUsersByRole('doctor');
      setDoctors(list);
      if (selected) {
        const d = list.find((x) => x.id === selected);
        if (d) setSelectedDoctor(d);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToMessages('parent', user.uid, setMessages);
    return unsub;
  }, [user]);

  const pick = async (d) => {
    setSelected(d.id);
    setSelectedDoctor(d);
  };

  const send = async () => {
    if (!msg.trim() || !selected) return;
    setSending(true);
    try {
      await sendMessageToDoctor(user.uid, selected, msg.trim());
      setMsg('');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSending(false);
    }
  };

  const thread = messages.filter((m) => m.doctorUid === selected);

  return (
    <Screen>
      <Text style={theme.font.h1}>Contact doctor 💬</Text>

      {!selected ? (
        <Card>
          <Text style={theme.font.h3}>Choose a doctor</Text>
          {doctors.length === 0 && <Text style={{ color: theme.colors.textMuted, marginTop: 10 }}>No doctors available yet.</Text>}
          {doctors.map((d) => (
            <Button
              key={d.id}
              title={`🩺 ${d.name || d.email}`}
              variant="ghost"
              onPress={() => pick(d)}
              style={{ marginTop: 8 }}
            />
          ))}
        </Card>
      ) : (
        <>
          <Card>
            <Text style={theme.font.h3}>Chatting with {selectedDoctor?.name || 'Doctor'}</Text>
            <Button title="Change doctor" variant="outline" onPress={() => setSelected(null)} style={{ marginTop: 10 }} />
          </Card>

          <Card>
            {thread.length === 0 ? (
              <Text style={{ color: theme.colors.textMuted }}>No messages yet. Say hi 👋</Text>
            ) : (
              thread.slice().reverse().map((m) => (
                <View key={m.id} style={[styles.msg, m.fromRole === 'parent' ? styles.mine : styles.theirs]}>
                  <Text>{m.text}</Text>
                </View>
              ))
            )}
          </Card>

          <Input value={msg} onChangeText={setMsg} placeholder="Type a message…" multiline />
          <Button title="Send" onPress={send} loading={sending} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  msg: { padding: 12, borderRadius: 14, marginVertical: 4, maxWidth: '85%' },
  mine: { backgroundColor: theme.colors.primarySoft, alignSelf: 'flex-end' },
  theirs: { backgroundColor: '#F3F4F6', alignSelf: 'flex-start' },
});
