import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, ADMIN_EMAIL } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkIsAdmin = (email) => {
    if (!email || !ADMIN_EMAIL) return false;
    return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  };

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        const isAdminUser = checkIsAdmin(firebaseUser.email);

        // Pre-populate user immediately so dashboard does not bounce back
        setUser((prev) => ({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          isAdmin: isAdminUser,
          ...(prev || {}),
        }));

        // Listen to user profile in real-time
        unsubscribeDoc = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userDoc.data(),
                isAdmin: isAdminUser,
              });
            } else {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
                isAdmin: isAdminUser,
              });
            }
            setLoading(false);
          },
          (error) => {
            console.warn("Firestore user snapshot error (fallback to auth profile):", error);
            // Fallback so user is not stuck on infinite loading
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              isAdmin: isAdminUser,
            });
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setLoading(false);
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  // Register new user
  const register = async (name, email, phone, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').trim();

    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const uid = userCredential.user.uid;
    const isAdminUser = checkIsAdmin(cleanEmail);

    // Optimistically set user state
    setUser({
      uid,
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      role: isAdminUser ? 'admin' : 'user',
      botPurchased: false,
      botName: '',
      isAdmin: isAdminUser,
    });

    // Store user profile in Firestore
    try {
      await setDoc(doc(db, 'users', uid), {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: isAdminUser ? 'admin' : 'user',
        botPurchased: false,
        botName: '',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Could not save profile to firestore immediately:", err);
    }

    return userCredential.user;
  };

  // Login existing user
  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const isAdminUser = checkIsAdmin(cleanEmail);

    // Optimistically set user state right away to prevent redirect race conditions
    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || userCredential.user.email?.split('@')[0],
      isAdmin: isAdminUser,
    });
    setLoading(false);

    return userCredential.user;
  };

  // Reset password
  const resetPassword = async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    return sendPasswordResetEmail(auth, cleanEmail);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
