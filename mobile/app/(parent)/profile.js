import React, { useState } from 'react';
import { Text, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { updateUserProfile } from '../../src/services/firestore';
import { useRouter } from 'expo-router';

export default function ParentProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(profile?.name || '');
  const [childName, setChildName] = useState(profile?.childName || '');
  const [childAge, setChildAge] = useState(profile?.childAge?.toString() || '');
  const [notes, setNotes] = useState(profile?.notes || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name, childName, childAge: childAge ? Number(childAge) : null, notes,
      });
      await refreshProfile();
      Alert.alert('Saved', 'Profile updated.');
      router.back();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Profile</Text>
      <Input label="Your name" value={name} onChangeText={setName} />
      <Input label="Child's name" value={childName} onChangeText={setChildName} />
      <Input label="Child's age" value={childAge} onChangeText={setChildAge} keyboardType="numeric" />
      <Input label="Notes for doctor" value={notes} onChangeText={setNotes} multiline placeholder="Allergies, triggers, preferences…" />
      <Button title="Save" onPress={save} loading={saving} />
      <Button title="Back" variant="outline" onPress={() => router.back()} />
    </Screen>
  );
}
