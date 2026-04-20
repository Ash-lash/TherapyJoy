import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, style }) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && { minHeight: 100, textAlignVertical: 'top' }, style]}
        autoCapitalize={secureTextEntry ? 'none' : 'sentences'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...theme.font.small, color: theme.colors.textMuted, marginLeft: 4 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
});
