import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { patternShapes } from './gameData';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { saveGameScore } from '../services/firestore';

const TOTAL_ROUNDS = 6;

function makePattern(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(patternShapes[Math.floor(Math.random() * patternShapes.length)]);
  }
  return arr;
}

export default function PatternGame({ onDone }) {
  const { user } = useAuth();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState([]);
  const [showing, setShowing] = useState(true);
  const [userInput, setUserInput] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const startRound = (r) => {
    const len = Math.min(3 + Math.floor(r / 2), 6);
    const p = makePattern(len);
    setPattern(p);
    setUserInput([]);
    setFeedback(null);
    setShowing(true);
    setTimeout(() => setShowing(false), 1500 + len * 400);
  };

  useEffect(() => { startRound(1); }, []);

  const onTap = (shape) => {
    if (showing || feedback) return;
    const next = [...userInput, shape];
    setUserInput(next);
    if (next.length === pattern.length) {
      const correct = next.every((s, i) => s === pattern[i]);
      setFeedback({ correct });
      if (correct) setScore((s) => s + 1);
      setTimeout(async () => {
        if (round >= TOTAL_ROUNDS) {
          const final = score + (correct ? 1 : 0);
          const stars = final >= 5 ? 3 : final >= 3 ? 2 : 1;
          try { if (user?.uid) await saveGameScore(user.uid, 'pattern', final, stars); } catch (e) {}
          onDone({ score: final, stars, total: TOTAL_ROUNDS });
        } else {
          const nr = round + 1;
          setRound(nr);
          startRound(nr);
        }
      }, 1200);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.progress}>Round {round} / {TOTAL_ROUNDS} · Score {score}</Text>
      <Text style={styles.question}>
        {showing ? 'Memorize this pattern…' : feedback ? (feedback.correct ? '🎉 Correct!' : '❌ Try the next one') : 'Now tap them in order'}
      </Text>

      <View style={styles.patternRow}>
        {(showing ? pattern : userInput).map((s, i) => (
          <View key={i} style={styles.patternSlot}><Text style={{ fontSize: 40 }}>{s}</Text></View>
        ))}
        {!showing && userInput.length < pattern.length && Array.from({ length: pattern.length - userInput.length }).map((_, i) => (
          <View key={`e${i}`} style={[styles.patternSlot, { opacity: 0.3 }]}><Text style={{ fontSize: 40 }}>?</Text></View>
        ))}
      </View>

      {!showing && (
        <View style={styles.choices}>
          {patternShapes.map((s) => (
            <Pressable key={s} onPress={() => onTap(s)} style={styles.choice}>
              <Text style={{ fontSize: 40 }}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 16 },
  progress: { textAlign: 'center', color: theme.colors.textMuted, fontWeight: '600' },
  question: { textAlign: 'center', fontSize: 18 },
  patternRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 80, flexWrap: 'wrap' },
  patternSlot: {
    width: 64, height: 64, borderRadius: 16, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.colors.border,
  },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 20 },
  choice: {
    width: 80, height: 80, borderRadius: 20, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.colors.border, ...theme.shadow,
  },
});
