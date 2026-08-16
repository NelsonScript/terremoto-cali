import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Puerto de infraestructura para Firebase. Cualquier feature que necesite
 * Firestore (ej. reportes, voluntariado) depende de `getDb()`, nunca de
 * `firebase/app` directamente — así el día que cambiemos de backend solo se
 * toca este archivo y los *.service.ts que lo usan.
 *
 * Variables de entorno con prefijo VITE_ (convención de Vite, equivalente a
 * las NEXT_PUBLIC_* del proyecto anterior). Ver .env.example.
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function getApp() {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase no está configurado. Define VITE_FIREBASE_* en .env.local (ver .env.example).'
    );
  }
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

let dbSingleton: Firestore | null = null;

export function getDb(): Firestore {
  if (!dbSingleton) {
    dbSingleton = getFirestore(getApp());
  }
  return dbSingleton;
}

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  isSupported()
    .then((supported) => {
      if (supported) getAnalytics(getApp());
    })
    .catch(() => {});
}
