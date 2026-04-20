import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { activateDummySubscription } from '../../src/services/firestore';
import { useRouter } from 'expo-router';

const PLANS = [
  { id: 'starter', price: '₹199', period: '/mo', name: 'Starter', perks: ['Mood tracking', 'All 3 games', 'Basic progress'] },
  { id: 'monthly', price: '₹499', period: '/mo', name: 'Premium', perks: ['Everything in Starter', 'Therapy videos', 'Priority doctor chat'], featured: true },
  { id: 'yearly',  price: '₹4,999', period: '/yr', name: 'Yearly', perks: ['Save 16%', 'All Premium features'] },
];

export default function Pricing() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(null);
  const active = profile?.subscription?.status === 'active';

  const pick = async (planId) => {
    Alert.alert(
      'Dummy checkout',
      'Razorpay is not wired yet. Activate a test subscription?',
      [
        { text: 'Cancel' },
        {
          text: 'Activate',
          onPress: async () => {
            setBusy(planId);
            try {
              await activateDummySubscription(user.uid, planId);
              await refreshProfile();
              Alert.alert('Activated 🎉', 'You now have Premium access.');
              router.replace('/(parent)/videos');
            } catch (e) {
              Alert.alert('Error', e.message);
            } finally {
              setBusy(null);
            }
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Choose a plan ⭐</Text>
      {active && (
        <Card style={{ backgroundColor: theme.colors.mint, borderColor: theme.colors.success }}>
          <Text style={{ fontWeight: '700' }}>✓ You're on the {profile.subscription.planId} plan</Text>
        </Card>
      )}
      {PLANS.map((p) => (
        <Card key={p.id} style={p.featured ? { borderColor: theme.colors.primary, borderWidth: 3 } : null}>
          {p.featured && <Text style={styles.badge}>MOST POPULAR</Text>}
          <Text style={theme.font.h2}>{p.name}</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: theme.colors.primary }}>
            {p.price}<Text style={{ fontSize: 14, color: theme.colors.textMuted }}>{p.period}</Text>
          </Text>
          <View style={{ marginVertical: 10 }}>
            {p.perks.map((perk, i) => (
              <Text key={i} style={{ color: theme.colors.text, marginVertical: 2 }}>✓ {perk}</Text>
            ))}
          </View>
          <Button
            title={active ? 'Current plan' : 'Choose'}
            onPress={() => pick(p.id)}
            loading={busy === p.id}
            disabled={active}
          />
        </Card>
      ))}
      <Text style={{ fontSize: 12, color: theme.colors.textMuted, textAlign: 'center' }}>
        Dummy checkout — real Razorpay integration coming later.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start', backgroundColor: theme.colors.accent, color: '#fff',
    fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, marginBottom: 8, overflow: 'hidden',
  },
});
