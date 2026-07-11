"use client";

const sessionKey = "careerTrust.visitorCountIncremented";

export async function trackFirebaseVisitors() {
  const [{ doc, getDoc, getFirestore, increment, serverTimestamp, setDoc, updateDoc }, { getFirebaseClientApp }] = await Promise.all([
    import("firebase/firestore"),
    import("@/firebase/client")
  ]);
  const app = getFirebaseClientApp();
  if (!app) return null;

  try {
    const database = getFirestore(app);
    const counter = doc(database, "counters", "visitors");

    if (!sessionStorage.getItem(sessionKey)) {
      try {
        await updateDoc(counter, { count: increment(1), updatedAt: serverTimestamp() });
      } catch {
        await setDoc(counter, { count: 1, updatedAt: serverTimestamp() });
      }
      sessionStorage.setItem(sessionKey, "true");
    }

    const snapshot = await getDoc(counter);
    return snapshot.exists() ? Number(snapshot.data().count ?? 1) : 1;
  } catch {
    return null;
  }
}
