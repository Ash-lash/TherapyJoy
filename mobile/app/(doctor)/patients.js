import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { listUsersByRole } from '../../src/services/firestore';
import TopBar from '../../src/components/TopBar';

export default function Patients() {
  const { user } = useAuth();
  const router = useRouter();
  const [parents, setParents] = useState([]);

  useEffect(() => {
    (async () => {
      const all = await listUsersByRole('parent');
      const mine = all.filter((p) => p.assignedDoctorUid === user.uid);
      setParents(mine);
    })();
  }, [user]);

  return (
    <Screen>
      <TopBar subtitle="Children assigned to your care" title="Your patients 🧒" />

      {parents.length === 0 ? (
        <Card>
          <Text style={{ color: theme.colors.textMuted }}>
            No patients assigned yet. Ask the admin to link parents to your account.
          </Text>
        </Card>
      ) : (
        parents.map((p) => (
          <Pressable key={p.id} onPress={() => router.push(`/(doctor)/patient/${p.id}`)}>
            <Card>
              <Text style={theme.font.h3}>{p.childName || 'Child'}</Text>
              <Text style={{ color: theme.colors.textMuted }}>Parent: {p.name || p.email}</Text>
              {p.childAge ? <Text style={{ color: theme.colors.textMuted }}>Age: {p.childAge}</Text> : null}
              <Text style={{ marginTop: 8, color: theme.colors.primary, fontWeight: '700' }}>View details →</Text>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
