import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuración pública de Firebase (segura de exponer en el cliente).
// Se definen como variables de entorno NEXT_PUBLIC_* para no hardcodear
// el proyecto real en el repositorio. Ver .env.example y README.md.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

function getApp() {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase no está configurado. Define NEXT_PUBLIC_FIREBASE_* en .env.local (ver .env.example)."
    );
  }
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

function getDb() {
  const app = getApp();
  return getFirestore(app);
}

if (typeof window !== "undefined" && isFirebaseConfigured) {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(getApp());
    }
  }).catch(() => {});
}

/**
 * Envía un documento a una colección de Firestore protegida por
 * reglas de "solo creación" (ver 03_architecture/firestore.rules).
 * No hay lectura pública: solo el equipo coordinador consulta los
 * datos desde la consola de Firebase.
 */
export async function submitToFirestore(
  coleccion: "reportes" | "voluntariado",
  data: Record<string, unknown>
) {
  const db = getDb();
  await addDoc(collection(db, coleccion), {
    ...data,
    creadoEn: serverTimestamp(),
  });
}
