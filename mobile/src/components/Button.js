import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { theme } from '../theme';

export default function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style }) {
  const s = styles[variant] || styles.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base, s,
        (disabled || loading) && { opacity: 0.6 },
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : theme.colors.primary} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon ? <Text style={{ fontSize: 18 }}>{icon}</Text> : null}
          <Text style={[styles.text, variant === 'primary' ? { color: '#fff' } : { color: theme.colors.primary }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: theme.colors.primary, ...theme.shadow },
  outline: { borderWidth: 2, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  ghost: { backgroundColor: theme.colors.primarySoft },
  danger: { backgroundColor: theme.colors.danger },
  text: { fontSize: 17, fontWeight: '700' },
});
