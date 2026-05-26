import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getFirebaseAdminAuth() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) return null;

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey })
      });

  return getAuth(app);
}

export async function verifyFirebaseToken(authorization?: string | null) {
  const token = authorization?.replace("Bearer ", "");
  const auth = getFirebaseAdminAuth();

  if (!token || !auth) return null;

  try {
    return await auth.verifyIdToken(token);
  } catch {
    return null;
  }
}
