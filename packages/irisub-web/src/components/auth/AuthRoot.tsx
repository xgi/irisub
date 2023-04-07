import { useRecoilState, useSetRecoilState } from "recoil";

import { ReactNode, useEffect, useState } from "react";
import {
  EmailAuthProvider,
  getAuth,
  isSignInWithEmailLink,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential
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
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
      console.log(`got email: ${email}`);
      if (!email) return;
    }

    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    const credential = EmailAuthProvider.credentialWithLink(email, window.location.href);

    linkWithCredential(currentUser, credential)
      .then((result) => {
        window.localStorage.removeItem("emailForSignIn");
        // window.location.href = "google.com/good";
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          // TODO: the anonymous user will be lost -- should prompt that they will lose their
          // current project, or migrate it here

          signInWithCredential(getAuth(), credential);
        } else {
          console.error(error);
        }
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
