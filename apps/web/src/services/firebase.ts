import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

export const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  initializeApp(firebaseConfig);

  if (import.meta.env.DEV) {
    connectAuthEmulator(getAuth(), import.meta.env.VITE_FIREBASE_AUTH_URL, {
      disableWarnings: true,
    });
  }
};
