import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { theme } from '../src/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function Gate() {
  const { user, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === undefined;

    if (!user) {
      if (!inAuth) router.replace('/login');
      return;
    }
    if (!profile) return;

    const role = profile.role;
    const group = segments[0];
    const inRoleGroup =
      (role === 'parent' && group === '(parent)') ||
      (role === 'doctor' && group === '(doctor)') ||
      (role === 'admin' && group === '(admin)');

    if (!inRoleGroup) {
      if (role === 'parent') router.replace('/(parent)/home');
      else if (role === 'doctor') router.replace('/(doctor)/patients');
      else if (role === 'admin') router.replace('/(admin)/users');
    }
  }, [user, profile, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.bg }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
