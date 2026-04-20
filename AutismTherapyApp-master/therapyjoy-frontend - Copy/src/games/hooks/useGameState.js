import { useCallback, useRef, useState } from 'react';
import { auth, saveGameScore } from '../../services/firebase';

export function calculateStars(score, extraStars = 0) {
  let stars = 1;
  if (score >= 9) stars = 3;
  else if (score >= 6) stars = 2;
  return Math.min(3, stars + extraStars);
}

export function useGameState(gameId, totalRounds = 10) {
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const startTimeRef = useRef(Date.now());

  const endGame = useCallback(
    async (finalScore, extraStars = 0) => {
      const finalStars = calculateStars(finalScore, extraStars);
      setIsSaving(true);

      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await saveGameScore(uid, gameId, finalScore, finalStars);
        }
      } catch (error) {
        // Keep the UX moving even if Firestore save fails.
        console.error('Failed to save game score:', error);
      } finally {
        setStars(finalStars);
        setScore(finalScore);
        setIsSaving(false);
        setIsGameOver(true);
      }
    },
    [gameId]
  );

  const submitRound = useCallback(
    async (wasCorrect, extraStars = 0) => {
      if (isGameOver || isSaving) return;

      const nextScore = score + (wasCorrect ? 1 : 0);
      const isFinalRound = currentRound >= totalRounds;

      if (isFinalRound) {
        await endGame(nextScore, extraStars);
        return;
      }

      setScore(nextScore);
      setCurrentRound((prev) => prev + 1);
    },
    [currentRound, endGame, isGameOver, isSaving, score, totalRounds]
  );

  const finishGame = useCallback(
    async (finalScore = score, extraStars = 0) => {
      if (isGameOver || isSaving) return;
      await endGame(finalScore, extraStars);
    },
    [endGame, isGameOver, isSaving, score]
  );

  const resetGame = useCallback(() => {
    setCurrentRound(1);
    setScore(0);
    setStars(0);
    setIsGameOver(false);
    setIsSaving(false);
    startTimeRef.current = Date.now();
  }, []);

  return {
    currentRound,
    totalRounds,
    score,
    stars,
    isSaving,
    isGameOver,
    sessionStartTime: startTimeRef.current,
    submitRound,
    finishGame,
    resetGame,
  };
}
