import React, { useState } from 'react';
import { View, Text, Alert, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Screen from '../src/components/Screen';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import { useAuth } from '../src/context/AuthContext';
import { theme } from '../src/theme';

const ROLES = [
  { id: 'parent', label: 'Parent', emoji: '👨‍👩‍👧', hint: 'I have a child using the app' },
  { id: 'doctor', label: 'Doctor', emoji: '🩺', hint: 'I treat and monitor children' },
];

export default function Signup() {
  const { register } = useAuth();
  const [role, setRole] = useState('parent');
  const [name, setName] = useState('');
  const [childName, setChildName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name) return Alert.alert('Missing info', 'Please fill all fields.');
    if (password.length < 6) return Alert.alert('Weak password', 'At least 6 characters.');
    setLoading(true);
    try {
      await register(email.trim(), password, role, name, childName);
    } catch (e) {
      Alert.alert('Signup failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Create account ✨</Text>
      <Text style={{ color: theme.colors.textMuted }}>Admin accounts are created by existing admins only.</Text>

      <View style={styles.roleRow}>
        {ROLES.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => setRole(r.id)}
            style={[styles.roleCard, role === r.id && styles.roleCardActive]}
          >
            <Text style={{ fontSize: 32 }}>{r.emoji}</Text>
            <Text style={[theme.font.h3, role === r.id && { color: theme.colors.primary }]}>{r.label}</Text>
            <Text style={styles.roleHint}>{r.hint}</Text>
          </Pressable>
        ))}
      </View>

      <Input label="Your name" value={name} onChangeText={setName} placeholder="Full name" />
      {role === 'parent' && (
        <Input label="Child's name (optional)" value={childName} onChangeText={setChildName} placeholder="e.g. Aarav" />
      )}
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="6+ characters" secureTextEntry />
      <Button title="Create account" onPress={handleSignup} loading={loading} />

      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Link href="/login" style={{ color: theme.colors.primary, fontWeight: '600' }}>
          Already have an account? Log in
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  roleRow: { flexDirection: 'row', gap: 12 },
  roleCard: {
    flex: 1, padding: 16, alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: theme.radius.lg,
    borderWidth: 2, borderColor: theme.colors.border,
  },
  roleCardActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
  roleHint: { fontSize: 12, color: theme.colors.textMuted, textAlign: 'center' },
});
