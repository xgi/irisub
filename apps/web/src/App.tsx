import "./styles/global/colors.scss";
import "./styles/global/general.scss";
import "./styles/global/reflex.scss";
import "./styles/global/player.scss";
import "./styles/global/tooltip.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import Base from "./components/Base";

import { initializeApp } from "firebase/app";
import { useEffect } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailLink,
} from "firebase/auth";
import { currentProjectIdState, userIdState } from "./store/states";
import { themeState, accentState } from "./store/theme";
import styles from "./styles/components/App.module.scss";
import { currentEventListState } from "./store/events";
import { currentProjectState } from "./store/project";
import { v4 as uuidv4 } from "uuid";

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

function App() {
  const [userId, setUserId] = useRecoilState(userIdState);
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [currentEventList, setCurrentEventList] = useRecoilState(currentEventListState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const theme = useRecoilValue(themeState);
  const accent = useRecoilValue(accentState);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      console.log(`auth state changed, now: ${user ? user.uid : "null"}`);

      setUserId(user ? user.uid : null);
      if (user) {
        setUserId(user.uid);

        if (isSignInWithEmailLink(getAuth(), window.location.href)) {
          // TODO: should copy local project to user account, similar to handleTemp

          let email = window.localStorage.getItem("emailForSignIn");
          if (!email) {
            email = window.prompt("Please provide your email for confirmation");
            console.log(`got email: ${email}`);
            if (!email) return;
          }
          signInWithEmailLink(getAuth(), email, window.location.href)
            .then((result) => {
              window.localStorage.removeItem("emailForSignIn");
              // window.location.href = "google.com/good";
            })
            .catch((error) => {
              console.log(error);
              // window.location.href = "google.com/bad";
            })
            .finally(() => {
              window.history.pushState({}, document.title, "/");
            });
        }
      } else {
        setCurrentProjectId(null);
        setUserId(null);

        console.log("wasn't logged in -- signing in anonymously");
        signInAnonymously(getAuth());
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    if (currentProjectId === null) {
      setCurrentProjectId(uuidv4());
    } else {
      console.log(`currentProjectId changed to ${currentProjectId}, resetting others`);
      setCurrentProject(null);
      setCurrentEventList(null);
      // resetProject();
      // resetCurrentEventList();
    }
  }, [currentProjectId, userId]);

  return userId === null || currentProject === null ? (
    <div className={styles.loadingPage}>
      <div className={styles.spin} />
    </div>
  ) : (
    <Base />
  );
}

export default App;
