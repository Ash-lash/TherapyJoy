import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, Pressable, Alert, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { listAllUsers, setUserRole } from '../../src/services/firestore';
import TopBar from '../../src/components/TopBar';

const ROLE_CYCLE = ['parent', 'doctor', 'admin'];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setRefreshing(true);
    try { setUsers(await listAllUsers()); } catch (e) { Alert.alert('Error', e.message); }
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeRole = (u) => {
    const next = ROLE_CYCLE[(ROLE_CYCLE.indexOf(u.role) + 1) % ROLE_CYCLE.length];
    Alert.alert('Change role', `Set ${u.email} to "${next}"?`, [
      { text: 'Cancel' },
      { text: 'Confirm', onPress: async () => { await setUserRole(u.id, next); load(); } },
    ]);
  };

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
        <TopBar title="Users 👥" subtitle="All accounts" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['all', 'parent', 'doctor', 'admin'].map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)}
              style={[styles.chip, filter === f && styles.chipActive]}>
              <Text style={{ fontWeight: '700', color: filter === f ? '#fff' : theme.colors.text, fontSize: 12 }}>
                {f.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
        {filtered.map((u) => (
          <Card key={u.id}>
            <Text style={theme.font.h3}>{u.name || '(unnamed)'}</Text>
            <Text style={{ color: theme.colors.textMuted }}>{u.email}</Text>
            <Text style={{ marginTop: 6 }}>Role: <Text style={{ fontWeight: '700', color: theme.colors.primary }}>{u.role || '—'}</Text></Text>
            {u.childName ? <Text>Child: {u.childName}</Text> : null}
            <Button title="Change role" variant="outline" onPress={() => changeRole(u)} style={{ marginTop: 10 }} />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.border },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
});
