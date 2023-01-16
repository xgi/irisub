import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

export const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDhxbmwAD0wSYYRdZhwNkXHetytT-T0VBU",
    authDomain: "irisub.firebaseapp.com",
    databaseURL: "https://irisub-default-rtdb.firebaseio.com",
    projectId: "irisub",
    storageBucket: "irisub.appspot.com",
    messagingSenderId: "42922342456",
    appId: "1:42922342456:web:e8d7467de3955c6bb40ecd",
  };
  const app = initializeApp(firebaseConfig);

  if (import.meta.env.DEV) {
    const auth = getAuth();
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  }
};
