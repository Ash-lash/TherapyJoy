import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { theme } from '../../src/theme';

const Icon = ({ char, color }) => <Text style={{ fontSize: 22, color }}>{char}</Text>;

export default function ParentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          height: 68, paddingBottom: 10, paddingTop: 8,
          borderTopColor: theme.colors.border, backgroundColor: '#fff',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => <Icon char="🏠" color={color} /> }} />
      <Tabs.Screen name="games" options={{ title: 'Games', tabBarIcon: ({ color }) => <Icon char="🎮" color={color} /> }} />
      <Tabs.Screen name="videos" options={{ title: 'Videos', tabBarIcon: ({ color }) => <Icon char="📺" color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <Icon char="📈" color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color }) => <Icon char="⚙️" color={color} /> }} />
      <Tabs.Screen name="game/[id]" options={{ href: null }} />
      <Tabs.Screen name="doctor" options={{ href: null }} />
      <Tabs.Screen name="pricing" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
