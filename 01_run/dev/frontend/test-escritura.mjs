// test-escritura.mjs
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA9agU4YJJM1DIaRTIzOGwmg-v2PuZeGEw",
    authDomain: "terremoto-colombia-2026.firebaseapp.com",
    projectId: "terremoto-colombia-2026",
    storageBucket: "terremoto-colombia-2026.firebasestorage.app",
    messagingSenderId: "107596389748",
    appId: "1:107596389748:web:6d471e5099823baaa4a021",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const doc = {
    titular: "PRUEBA — borrar manualmente desde consola",
    resumen: "Documento de prueba para validar que las reglas de Firestore aceptan escrituras en feed_noticias.",
    categoria: "otro",
    departamento: null,
    municipio: null,
    fechaPublicacion: new Date().toISOString(),
    fuente: { nombre: "Prueba manual", url: "https://example.com", tipo: "medio" },
    corroboracion: { nivel: "fuente-unica", fuentesAdicionales: [] },
    cifras: [],
    noOficial: true,
    notaAmbiguedad: null,
    creadoPor: "prueba-manual-nelson",
};

try {
    const ref = await addDoc(collection(db, 'feed_noticias'), doc);
    console.log("✅ Escritura exitosa. ID:", ref.id);
} catch (e) {
    console.error("❌ Falló la escritura:", e.message);
}