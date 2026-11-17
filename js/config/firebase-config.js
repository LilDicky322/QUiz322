// Configuración de la app web (proyecto agregado-bb246).
// Estas claves identifican el proyecto y son públicas en apps web; la seguridad la dan las reglas de Firestore.
export const firebaseConfig = {
  apiKey: "AIzaSyBwFkohV2dt6jCzeypEOU89x7QHGKq3ZZE",
  authDomain: "agregado-bb246.firebaseapp.com",
  projectId: "agregado-bb246",
  storageBucket: "agregado-bb246.firebasestorage.app",
  messagingSenderId: "814660448463",
  appId: "1:814660448463:web:93033de495396bb260c7ba",
  measurementId: "G-Y7YZC8XZBW"
};
// Si dejas el apiKey como "TU_API_KEY", el juego usa data/levels.sample.json y localStorage.
export const USE_FIREBASE = firebaseConfig.apiKey !== "TU_API_KEY";
