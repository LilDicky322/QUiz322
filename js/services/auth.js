import { getFirebase } from "./firebase.js";

// Sesión anónima: cada jugador obtiene un uid sin registrarse.
export async function ensureUser() {
  const fb = await getFirebase();
  if (!fb) return null;
  const { auth, authMod } = fb;
  const existing = await new Promise(res => {
    const off = authMod.onAuthStateChanged(auth, u => { off(); res(u); });
  });
  return existing || (await authMod.signInAnonymously(auth)).user;
}
