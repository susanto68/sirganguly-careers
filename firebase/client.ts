"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export function getFirebaseClientApp() {
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    return null;
  }

  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export function getFirebaseAuthClient() {
  const app = getFirebaseClientApp();
  return app ? getAuth(app) : null;
}

export const googleProvider = new GoogleAuthProvider();
