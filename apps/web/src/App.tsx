import "./styles/global/colors.scss";
import "./styles/global/general.scss";
import "./styles/global/reflex.scss";
import "./styles/global/player.scss";
import "./styles/global/tooltip.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import Base from "./components/Base";

import { useEffect } from "react";
import { currentProjectIdState, currentTrackIdState, userIdState } from "./store/states";
import { themeState, accentState } from "./store/theme";
import LoadingPage from "./components/LoadingPage";

function App() {
  const userId = useRecoilValue(userIdState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const theme = useRecoilValue(themeState);
  const accent = useRecoilValue(accentState);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  return userId === null || currentProjectId === null ? <LoadingPage /> : <Base />;
}

export default App;
