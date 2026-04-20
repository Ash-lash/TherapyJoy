import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../src/components/Button';
import { theme } from '../src/theme';
import { StatusBar } from 'expo-status-bar';

export default function Welcome() {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <StatusBar style="dark" />
      <View style={styles.hero}>
        <Image source={require('../assets/logo-512.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>TherapyJoy</Text>
        <Text style={styles.subtitle}>
          Gentle, playful therapy games for kids on the autism spectrum — with progress tracking for parents and doctors.
        </Text>
      </View>
      <View style={{ gap: 12, width: '100%' }}>
        <Button title="Log in" onPress={() => router.push('/login')} />
        <Button title="Create account" variant="outline" onPress={() => router.push('/signup')} />
      </View>
      <Text style={styles.footer}>Built with care · dakhSolutions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.bg, padding: 28, justifyContent: 'space-between', paddingTop: 80, paddingBottom: 40 },
  hero: { alignItems: 'center', gap: 14 },
  logo: { width: 160, height: 160, borderRadius: 32 },
  title: { fontSize: 40, fontWeight: '800', color: theme.colors.primaryDark },
  subtitle: { fontSize: 17, textAlign: 'center', color: theme.colors.textMuted, lineHeight: 24, paddingHorizontal: 10 },
  footer: { textAlign: 'center', color: theme.colors.textMuted, fontSize: 12 },
});
