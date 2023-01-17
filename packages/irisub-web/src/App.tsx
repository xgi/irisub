import "./styles/global/colors.scss";
import "./styles/global/general.scss";
import "./styles/global/reflex.scss";
import "./styles/global/player.scss";
import "./styles/global/tooltip.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import Base from "./components/Base";

import { useEffect } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailLink,
} from "firebase/auth";
import { DatabaseReference, getDatabase, onValue, ref, Unsubscribe } from "firebase/database";
import { currentProjectIdState, userIdState } from "./store/states";
import { themeState, accentState } from "./store/theme";
import styles from "./styles/components/App.module.scss";
import { gql, useMutation, useQuery } from "@apollo/client";

const ADD_PROJECT = gql`
  mutation insert_project($object: projects_insert_input!) {
    insert_projects_one(object: $object) {
      id
      title
    }
  }
`;

const GET_PROJECT = gql`
  query get_project($project_id: uuid!) {
    projects_by_pk(id: $project_id) {
      id
      title
    }
  }
`;

function App() {
  const [addProject, addProjectResult] = useMutation(ADD_PROJECT);

  const [userId, setUserId] = useRecoilState(userIdState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const theme = useRecoilValue(themeState);
  const accent = useRecoilValue(accentState);

  const getProjectResult = useQuery(GET_PROJECT, { variables: { project_id: currentProjectId } });

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  useEffect(() => {
    if (getProjectResult.data && getProjectResult.data.projects_by_pk) {
      setCurrentProjectId(getProjectResult.data.projects_by_pk.id);
    } else if (addProjectResult.data && addProjectResult.data.insert_projects_one) {
      setCurrentProjectId(addProjectResult.data.insert_projects_one.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProjectResult.data, addProjectResult.data]);

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
  }, []);

  useEffect(() => {
    if (
      currentProjectId &&
      getProjectResult.data &&
      getProjectResult.data.projects_by_pk === null
    ) {
      setCurrentProjectId(null);
    }
  }, [getProjectResult]);

  useEffect(() => {
    if (!userId) return;
    if (currentProjectId === null) {
      // TODO: use custom action which validates whether allowed to make new project
      addProject({ variables: { object: { title: "some new project" } } });
    }
  }, [currentProjectId, userId]);

  return userId === null || addProjectResult.loading || getProjectResult.loading ? (
    <div className={styles.loadingPage}>
      <div className={styles.spin} />
    </div>
  ) : (
    <Base />
  );
}

export default App;
