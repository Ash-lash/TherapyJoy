import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile, createUserProfile } from '../services/firestore';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const p = await getUserProfile(u.uid);
          setProfile(p);
        } catch (e) {
          console.log('Profile load err', e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.uid);
      setProfile(p);
      return p;
    }
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, role, name, childName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(cred.user.uid, {
      email, role, name: name || '',
      ...(role === 'parent' ? { childName: childName || '' } : {}),
    });
    const p = await getUserProfile(cred.user.uid);
    setProfile(p);
    return cred;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
