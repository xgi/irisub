import "./styles/global/colors.scss";
import "./styles/global/general.scss";
import "./styles/global/reflex.scss";
import "./styles/global/player.scss";
import "./styles/global/tooltip.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import Base from "./components/Base";

import { useEffect } from "react";
import { currentProjectIdState, userIdState } from "./store/states";
import { themeState, accentState } from "./store/theme";
import { gql, useMutation, useQuery } from "@apollo/client";
import LoadingPage from "./components/LoadingPage";
import { GET_PROJECT, INSERT_PROJECT } from "./constants/graphql";

function App() {
  const [addProject, addProjectResult] = useMutation(INSERT_PROJECT);

  const userId = useRecoilValue(userIdState);
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
    <LoadingPage />
  ) : (
    <Base />
  );
}

export default App;
