import React from 'react';
import { Text, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function AdminProfile() {
  const { profile, logout } = useAuth();
  return (
    <Screen>
      <Text style={theme.font.h1}>Admin 👑</Text>
      <Card>
        <Text style={theme.font.h3}>{profile?.name || 'Admin'}</Text>
        <Text style={{ color: theme.colors.textMuted }}>{profile?.email}</Text>
      </Card>
      <Card>
        <Text style={theme.font.h3}>How to create more admins</Text>
        <Text style={{ marginTop: 6, color: theme.colors.textMuted, lineHeight: 20 }}>
          New users sign up as "parent" or "doctor". To promote someone to admin, go to Users tab,
          tap "Change role" until it reaches "admin".
        </Text>
      </Card>
      <Button title="Log out" variant="danger" onPress={() => {
        Alert.alert('Log out?', '', [{ text: 'Cancel' }, { text: 'Log out', style: 'destructive', onPress: logout }]);
      }} />
    </Screen>
  );
}
