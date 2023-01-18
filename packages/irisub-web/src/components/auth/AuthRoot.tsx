import { useRecoilState, useSetRecoilState } from "recoil";

import { ReactNode, useEffect } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailLink,
} from "firebase/auth";
import { DatabaseReference, getDatabase, onValue, ref, Unsubscribe } from "firebase/database";
import { currentProjectIdState, userIdState } from "../../store/states";
import LoadingPage from "../LoadingPage";

type Props = {
  children?: ReactNode;
};

const AuthRoot: React.FC<Props> = (props: Props) => {
  const [userId, setUserId] = useRecoilState(userIdState);
  const setCurrentProjectId = useSetRecoilState(currentProjectIdState);

  const handleEmailLogin = () => {
    // TODO: should maybe copy local project to user account

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
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    let metadataRef: DatabaseReference | null = null;

    console.log("CREATING LISTENER (SHOULD ONLY RUN ONCE)");

    onAuthStateChanged(getAuth(), (user) => {
      console.log(`auth state changed, now: ${user ? user.uid : "null"}`);

      setUserId(user ? user.uid : null);
      if (unsubscribe) unsubscribe();

      if (user) {
        setUserId(user.uid);
        if (isSignInWithEmailLink(getAuth(), window.location.href)) {
          handleEmailLogin();
          return;
        }

        if (user) {
          metadataRef = ref(getDatabase(), "metadata/" + user.uid + "/refreshTime");
          unsubscribe = onValue(metadataRef, (snapshot) => {
            // TODO: add database rules to disable writing metadata/ and allow reading user's own
            // user.getIdToken(true).then((thing) => console.log(thing));
            user.getIdTokenResult(true).then((thing) => console.log(thing));
          });
        }
      } else {
        setCurrentProjectId(null);
        setUserId(null);

        console.log("wasn't logged in -- signing in anonymously");
        signInAnonymously(getAuth());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return userId === null ? <LoadingPage /> : <>{props.children}</>;
};

export default AuthRoot;
