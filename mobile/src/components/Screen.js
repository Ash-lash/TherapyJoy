import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../theme';

export default function Screen({ children, scroll = true, padded = true, style }) {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <Container
        contentContainerStyle={scroll ? [padded && styles.padded, style] : null}
        style={!scroll ? [styles.flex, padded && styles.padded, style] : styles.flex}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  flex: { flex: 1 },
  padded: { padding: 20, gap: 16 },
});
