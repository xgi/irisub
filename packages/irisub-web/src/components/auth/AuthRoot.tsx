import { useRecoilState, useSetRecoilState } from "recoil";

import { ReactNode, useEffect, useState } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailLink,
} from "firebase/auth";
import { currentProjectIdState, currentTrackIdState, userIdState } from "../../store/states";
import LoadingPage from "../LoadingPage";
import { gateway } from "../../services/gateway";

type Props = {
  children?: ReactNode;
};

const AuthRoot: React.FC<Props> = (props: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useRecoilState(userIdState);
  const setCurrentProjectId = useSetRecoilState(currentProjectIdState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);

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
    onAuthStateChanged(getAuth(), (user) => {
      console.log(`auth state changed, now: ${user ? user.uid : "null"}`);

      setAuthenticated(false);
      setUserId(user ? user.uid : null);

      if (user) {
        setUserId(user.uid);
        if (isSignInWithEmailLink(getAuth(), window.location.href)) {
          handleEmailLogin();
          return;
        }

        user
          .getIdToken()
          .then((idToken) => {
            return gateway.sessionLogin(idToken);
          })
          .then(() => {
            setAuthenticated(true);
          })
          .catch((err) => {
            console.error(`Session login failed: ${err}`);
          });
      } else {
        setCurrentProjectId(null);
        setCurrentTrackId(null);
        setUserId(null);

        console.log("wasn't logged in -- signing in anonymously");
        signInAnonymously(getAuth());
      }
    });
  }, []);

  return authenticated ? <>{props.children}</> : <LoadingPage />;
};

export default AuthRoot;
