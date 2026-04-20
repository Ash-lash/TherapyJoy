import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function TopBar({ title, subtitle }) {
  const { logout } = useAuth();
  const confirm = () => {
    Alert.alert('Log out?', '', [
      { text: 'Cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Pressable onPress={confirm} style={styles.btn}>
        <Text style={styles.btnText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { ...theme.font.h1 },
  subtitle: { ...theme.font.small, color: theme.colors.textMuted },
  btn: {
    paddingVertical: 8, paddingHorizontal: 14,
    backgroundColor: theme.colors.primarySoft, borderRadius: 20,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  btnText: { color: theme.colors.primary, fontWeight: '700', fontSize: 13 },
});
