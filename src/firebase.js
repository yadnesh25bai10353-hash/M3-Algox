import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfI0KR1D6p-s94v3YHRIkg71PUJn6UXq0",
  authDomain: "m3-algox.firebaseapp.com",
  projectId: "m3-algox",
  storageBucket: "m3-algox.firebasestorage.app",
  messagingSenderId: "537366288785",
  appId: "1:537366288785:web:a930ae084c8c63fb65e230",
  measurementId: "G-QR96JCRKBC"
};

// ╔══════════════════════════════════════════════════════════════╗
// ║  ADMIN EMAIL — Change this to YOUR email                    ║
// ╚══════════════════════════════════════════════════════════════╝
export const ADMIN_EMAIL = "yadnyeshmahale09@gmail.com";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
