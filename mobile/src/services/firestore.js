import {
  doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where,
  orderBy, limit, getDocs, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: uid, ...snap.data() } : null;
}

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
    subscription: { status: 'free', planId: null },
  }, { merge: true });
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function saveGameScore(uid, gameId, score, stars) {
  const today = new Date().toISOString().slice(0, 10);
  const gameRef = doc(collection(db, 'users', uid, 'gameScores'));
  await setDoc(gameRef, {
    gameId, score, stars, date: today, createdAt: serverTimestamp(),
  });

  const progRef = doc(db, 'users', uid, 'progress', today);
  const existing = await getDoc(progRef);
  const base = existing.exists() ? existing.data() : { games: 0, totalScore: 0, totalStars: 0 };
  await setDoc(progRef, {
    date: today,
    games: (base.games || 0) + 1,
    totalScore: (base.totalScore || 0) + score,
    totalStars: (base.totalStars || 0) + stars,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getWeeklyProgress(uid) {
  const q = query(collection(db, 'users', uid, 'progress'), orderBy('date', 'desc'), limit(7));
  const snap = await getDocs(q);
  let completedGames = 0, totalScore = 0, totalStars = 0;
  snap.forEach((d) => {
    const x = d.data();
    completedGames += x.games || 0;
    totalScore += x.totalScore || 0;
    totalStars += x.totalStars || 0;
  });
  const averageStars = completedGames ? +(totalStars / completedGames).toFixed(1) : 0;
  return { completedGames, averageStars, totalScore, days: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
}

export async function getMoodHistory(uid, days = 30) {
  const q = query(collection(db, 'users', uid, 'moods'), orderBy('date', 'desc'), limit(days));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveMood(uid, mood) {
  const today = new Date().toISOString().slice(0, 10);
  await setDoc(doc(db, 'users', uid, 'moods', today), {
    date: today, mood, createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function sendMessageToDoctor(parentUid, doctorUid, text) {
  await addDoc(collection(db, 'messages'), {
    parentUid, doctorUid, text, fromRole: 'parent',
    createdAt: serverTimestamp(), read: false,
  });
}

export async function sendMessageToParent(doctorUid, parentUid, text) {
  await addDoc(collection(db, 'messages'), {
    parentUid, doctorUid, text, fromRole: 'doctor',
    createdAt: serverTimestamp(), read: false,
  });
}

export function listenToMessages(role, uid, callback) {
  const field = role === 'parent' ? 'parentUid' : 'doctorUid';
  const q = query(collection(db, 'messages'), where(field, '==', uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function listUsersByRole(role) {
  const q = query(collection(db, 'users'), where('role', '==', role));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function setUserRole(uid, role) {
  await updateDoc(doc(db, 'users', uid), { role });
}

export async function assignDoctorToParent(parentUid, doctorUid) {
  await updateDoc(doc(db, 'users', parentUid), { assignedDoctorUid: doctorUid });
}

export async function listVideos() {
  const snap = await getDocs(collection(db, 'videos'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addVideo(data) {
  await addDoc(collection(db, 'videos'), { ...data, createdAt: serverTimestamp() });
}

export async function activateDummySubscription(uid, planId = 'monthly') {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  await updateDoc(doc(db, 'users', uid), {
    subscription: {
      planId, status: 'active', startedAt: new Date(), expiresAt: expires, dummy: true,
    },
  });
}
