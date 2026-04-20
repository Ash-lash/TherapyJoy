import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, pickN } from './gameData';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { saveGameScore } from '../services/firestore';

const TOTAL_ROUNDS = 8;

export default function ColorGame({ onDone }) {
  const { user } = useAuth();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const newRound = () => {
    const c = pickN(colors, 4);
    const a = c[Math.floor(Math.random() * c.length)];
    setChoices(c);
    setAnswer(a);
    setFeedback(null);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (c) => {
    if (feedback) return;
    const correct = c.id === answer.id;
    setFeedback({ correct, picked: c.id });
    if (correct) setScore((s) => s + 1);
    setTimeout(async () => {
      if (round >= TOTAL_ROUNDS) {
        const final = score + (correct ? 1 : 0);
        const stars = final >= 7 ? 3 : final >= 5 ? 2 : 1;
        try { if (user?.uid) await saveGameScore(user.uid, 'color', final, stars); } catch (e) {}
        onDone({ score: final, stars, total: TOTAL_ROUNDS });
      } else {
        setRound((r) => r + 1);
        newRound();
      }
    }, 900);
  };

  if (!answer) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.progress}>Round {round} / {TOTAL_ROUNDS} · Score {score}</Text>
      <Text style={styles.question}>Which color is this?</Text>
      <View style={styles.target}>
        <View style={[styles.swatch, { backgroundColor: answer.hex }]}>
          <Text style={{ fontSize: 64 }}>{answer.item}</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {choices.map((c) => {
          const isPicked = feedback?.picked === c.id;
          const showCorrect = feedback && c.id === answer.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => pick(c)}
              style={[
                styles.choice,
                isPicked && feedback.correct && { borderColor: theme.colors.success, borderWidth: 4 },
                isPicked && !feedback.correct && { borderColor: theme.colors.danger, borderWidth: 4 },
                !isPicked && showCorrect && { borderColor: theme.colors.success, borderWidth: 4 },
              ]}
            >
              <Text style={styles.choiceLabel}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {feedback && (
        <Text style={[styles.feedback, { color: feedback.correct ? theme.colors.success : theme.colors.danger }]}>
          {feedback.correct ? '🌟 Correct!' : `It was ${answer.label}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 16 },
  progress: { textAlign: 'center', color: theme.colors.textMuted, fontWeight: '600' },
  question: { textAlign: 'center', fontSize: 18 },
  target: { alignItems: 'center', paddingVertical: 10 },
  swatch: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  choice: {
    width: '47%', minHeight: 80, borderRadius: theme.radius.lg,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: theme.colors.border,
  },
  choiceLabel: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  feedback: { textAlign: 'center', fontSize: 16, fontWeight: '700' },
});
