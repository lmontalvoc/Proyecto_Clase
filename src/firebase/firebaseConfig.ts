import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace the values below with your Firebase project's config.
// You can find these in the Firebase Console -> Project settings.
const firebaseConfig = {
apiKey: "AIzaSyCmFJLURMmcdkYAaALe3VerUweU7rZhzHA",
  authDomain: "que-es-esto-481d4.firebaseapp.com",
  projectId: "que-es-esto-481d4",
  storageBucket: "que-es-esto-481d4.firebasestorage.app",
  messagingSenderId: "582590320768",
  appId: "1:582590320768:web:9274ea7d3ce99c0f0ed665"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Usar getAuth en lugar de initializeAuth con AsyncStorage para
// mantener la persistencia EN MEMORIA (no se guarda entre reinicios de la app).
// Esto hace que la sesión permanezca mientras la app esté abierta,
// y al cerrarla el usuario deba volver a iniciar sesión.
export const auth = getAuth(app);
export const db = getFirestore(app);

// Notes:
// - Replace the placeholder strings above with your real Firebase config.
// - In an Expo-managed app you may also need to add the iOS/Android
//   native config files (GoogleService-Info.plist / google-services.json)
//   if you use some native Firebase SDK features. For web-style usage
//   (Auth + Firestore over JS SDK) the above is usually sufficient.
