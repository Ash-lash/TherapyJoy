import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function More() {
  const { profile, logout } = useAuth();
  const router = useRouter();
  const isPremium = profile?.subscription?.status === 'active';

  const rows = [
    { label: 'Profile', emoji: '👤', to: '/(parent)/profile' },
    { label: 'Contact doctor', emoji: '💬', to: '/(parent)/doctor' },
    { label: isPremium ? 'Subscription' : 'Upgrade to Premium', emoji: '⭐', to: '/(parent)/pricing' },
  ];

  return (
    <Screen>
      <Text style={theme.font.h1}>More</Text>
      <Card>
        <Text style={theme.font.h3}>{profile?.name}</Text>
        <Text style={{ color: theme.colors.textMuted }}>{profile?.email}</Text>
        {profile?.childName ? (
          <Text style={{ marginTop: 4 }}>Child: {profile.childName}</Text>
        ) : null}
        <View style={styles.badge}>
          <Text style={{ color: isPremium ? theme.colors.success : theme.colors.textMuted, fontWeight: '700' }}>
            {isPremium ? '⭐ Premium' : 'Free plan'}
          </Text>
        </View>
      </Card>

      <Card style={{ padding: 0 }}>
        {rows.map((r, i) => (
          <Pressable
            key={r.label}
            onPress={() => router.push(r.to)}
            style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
          >
            <Text style={{ fontSize: 22 }}>{r.emoji}</Text>
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '600' }}>{r.label}</Text>
            <Text style={{ fontSize: 20, color: theme.colors.textMuted }}>›</Text>
          </Pressable>
        ))}
      </Card>

      <Pressable
        onPress={() => {
          Alert.alert('Log out?', '', [
            { text: 'Cancel' },
            { text: 'Log out', style: 'destructive', onPress: logout },
          ]);
        }}
        style={styles.logout}
      >
        <Text style={{ color: theme.colors.danger, fontWeight: '700' }}>Log out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: { marginTop: 10, alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  logout: { alignItems: 'center', padding: 16 },
});
