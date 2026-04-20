import React, { useState } from 'react';
import { Text, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Card from '../../src/components/Card';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { theme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { updateUserProfile } from '../../src/services/firestore';

export default function DoctorProfile() {
  const { user, profile, logout, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [specialty, setSpecialty] = useState(profile?.specialty || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const save = async () => {
    try {
      await updateUserProfile(user.uid, { name, specialty, bio });
      await refreshProfile();
      Alert.alert('Saved');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <Screen>
      <Text style={theme.font.h1}>Doctor profile 🩺</Text>
      <Card>
        <Text style={{ color: theme.colors.textMuted }}>{profile?.email}</Text>
      </Card>
      <Input label="Name" value={name} onChangeText={setName} />
      <Input label="Specialty" value={specialty} onChangeText={setSpecialty} placeholder="e.g. Developmental pediatrics" />
      <Input label="Bio" value={bio} onChangeText={setBio} multiline placeholder="A short note for parents…" />
      <Button title="Save" onPress={save} />
      <Button title="Log out" variant="danger" onPress={logout} />
    </Screen>
  );
}
