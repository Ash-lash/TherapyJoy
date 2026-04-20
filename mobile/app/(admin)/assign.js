import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { listUsersByRole, assignDoctorToParent } from '../../src/services/firestore';

export default function Assign() {
  const [parents, setParents] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selParent, setSelParent] = useState(null);
  const [selDoctor, setSelDoctor] = useState(null);

  const load = async () => {
    setParents(await listUsersByRole('parent'));
    setDoctors(await listUsersByRole('doctor'));
  };

  useEffect(() => { load(); }, []);

  const assign = async () => {
    if (!selParent || !selDoctor) return Alert.alert('Pick both', 'Select a parent and a doctor.');
    try {
      await assignDoctorToParent(selParent, selDoctor);
      Alert.alert('Assigned', 'Parent is now linked to doctor.');
      setSelParent(null); setSelDoctor(null);
      load();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Link parent ↔ doctor 🔗</Text>

      <Card>
        <Text style={theme.font.h3}>1. Pick parent</Text>
        {parents.length === 0 && <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>No parents yet.</Text>}
        {parents.map((p) => (
          <Pressable key={p.id} onPress={() => setSelParent(p.id)}
            style={[styles.row, selParent === p.id && styles.rowActive]}>
            <Text style={{ fontWeight: '700' }}>{p.name || p.email}</Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
              Child: {p.childName || '—'} · Current doctor: {p.assignedDoctorUid ? '✓' : '—'}
            </Text>
          </Pressable>
        ))}
      </Card>

      <Card>
        <Text style={theme.font.h3}>2. Pick doctor</Text>
        {doctors.length === 0 && <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>No doctors yet.</Text>}
        {doctors.map((d) => (
          <Pressable key={d.id} onPress={() => setSelDoctor(d.id)}
            style={[styles.row, selDoctor === d.id && styles.rowActive]}>
            <Text style={{ fontWeight: '700' }}>{d.name || d.email}</Text>
            {d.specialty ? <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>{d.specialty}</Text> : null}
          </Pressable>
        ))}
      </Card>

      <Button title="Link them" onPress={assign} disabled={!selParent || !selDoctor} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 12, borderRadius: 12, marginTop: 8,
    borderWidth: 2, borderColor: theme.colors.border, backgroundColor: '#fff',
  },
  rowActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
});
