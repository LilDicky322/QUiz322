# Relacionar Columnas (arcade retro · UNAJ)

Juego de emparejar columnas con estética arcade. Firebase: Auth anónima + Firestore + Hosting. Sin compilación.

- Los jugadores ingresan su nombre antes de jugar; el puntaje se guarda por jugador y ronda (solo si mejora).
- El panel **TOP EN VIVO** se actualiza en tiempo real con `onSnapshot`.
- Las rondas están en `data/levels.json` (R1, R2, R3 y Extra opcional).

## Probar en local
    python3 -m http.server 8000     # o: npx serve .
Abre http://localhost:8000. Si el apiKey de `js/config/firebase-config.js` es "TU_API_KEY", los puntajes se guardan solo en el navegador.

## Firebase
1. Consola → **Authentication → Método de acceso → Anónimo**: activar.
2. **Firestore Database**: crear la base de datos.
3. Publicar reglas y sitio: `npm i -g firebase-tools && firebase login && firebase deploy`
   (reglas en `firestore.rules`; ID de proyecto en `.firebaserc`).
