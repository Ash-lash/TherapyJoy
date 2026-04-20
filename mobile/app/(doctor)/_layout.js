import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { theme } from '../../src/theme';

const Icon = ({ char, color }) => <Text style={{ fontSize: 22, color }}>{char}</Text>;

export default function DoctorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { height: 68, paddingBottom: 10, paddingTop: 8, borderTopColor: theme.colors.border, backgroundColor: '#fff' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="patients" options={{ title: 'Patients', tabBarIcon: ({ color }) => <Icon char="🧒" color={color} /> }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: ({ color }) => <Icon char="💬" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Icon char="👤" color={color} /> }} />
      <Tabs.Screen name="patient/[id]" options={{ href: null }} />
    </Tabs>
  );
}
