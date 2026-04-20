import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from 'firebase/firestore';
import app from '../firebase';

export const auth = getAuth(app);
export const db = getFirestore(app);

export async function saveGameScore(uid, gameId, score, stars) {
  if (!uid) {
    throw new Error('Missing user id while saving game score.');
  }

  const gameDocRef = doc(db, 'progress', uid, 'games', gameId);
  const existing = await getDoc(gameDocRef);
  const previousAttempts = existing.exists() ? existing.data().attempts || 0 : 0;

  await setDoc(
    gameDocRef,
    {
      score,
      stars,
      attempts: previousAttempts + 1,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getWeeklyProgress(uid) {
  if (!uid) {
    return {
      completedGames: 0,
      averageStars: 0,
      totalScore: 0,
    };
  }

  const gamesRef = collection(db, 'progress', uid, 'games');
  const snapshot = await getDocs(gamesRef);

  let completedGames = 0;
  let starsTotal = 0;
  let totalScore = 0;

  snapshot.forEach((gameDoc) => {
    const data = gameDoc.data();
    completedGames += 1;
    starsTotal += data.stars || 0;
    totalScore += data.score || 0;
  });

  return {
    completedGames,
    averageStars: completedGames > 0 ? Number((starsTotal / completedGames).toFixed(1)) : 0,
    totalScore,
  };
}
