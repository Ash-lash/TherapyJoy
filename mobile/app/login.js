import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Screen from '../src/components/Screen';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import { useAuth } from '../src/context/AuthContext';
import { theme } from '../src/theme';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Missing info', 'Email and password required.');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Login failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Welcome back 👋</Text>
      <Text style={{ color: theme.colors.textMuted }}>Log in to continue your child's therapy journey.</Text>
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
      <Button title="Log in" onPress={handleLogin} loading={loading} />
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Link href="/signup" style={{ color: theme.colors.primary, fontWeight: '600' }}>
          Don't have an account? Sign up
        </Link>
      </View>
    </Screen>
  );
}
