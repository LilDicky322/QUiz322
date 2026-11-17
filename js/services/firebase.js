import { firebaseConfig, USE_FIREBASE } from "../config/firebase-config.js";

const BASE = "https://www.gstatic.com/firebasejs/10.14.1";
let cache;

// Carga el SDK solo si Firebase está configurado. Devuelve null si no.
export function getFirebase() {
  if (!USE_FIREBASE) return Promise.resolve(null);
  cache ||= (async () => {
    const [app, authMod, fsMod] = await Promise.all([
      import(`${BASE}/firebase-app.js`),
      import(`${BASE}/firebase-auth.js`),
      import(`${BASE}/firebase-firestore.js`)
    ]);
    const a = app.initializeApp(firebaseConfig);
    return { auth: authMod.getAuth(a), db: fsMod.getFirestore(a), authMod, fsMod };
  })();
  return cache;
}
