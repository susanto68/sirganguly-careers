"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getFirebaseAuthClient, googleProvider } from "@/firebase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const auth = getFirebaseAuthClient();

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setReady(true);
    });
  }, [auth]);

  return {
    user,
    ready,
    configured: Boolean(auth),
    signInWithGoogle: () => (auth ? signInWithPopup(auth, googleProvider) : Promise.reject(new Error("Firebase is not configured."))),
    signInWithEmail: (email: string, password: string) =>
      auth ? signInWithEmailAndPassword(auth, email, password) : Promise.reject(new Error("Firebase is not configured.")),
    signOut: () => (auth ? signOut(auth) : Promise.resolve())
  };
}
