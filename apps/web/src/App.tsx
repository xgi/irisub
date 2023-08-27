import './index.css';
import 'react-tooltip/dist/react-tooltip.css';
import './styles/global/tooltip.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Base from './components/Base';

import { useEffect } from 'react';
import {
  currentCueListState,
  currentProjectIdState,
  currentProjectState,
  currentTrackListState,
} from './store/states';
import { themeState, accentState } from './store/theme';
import LoadingContainer from './components/LoadingContainer';
import { playerPathState } from './store/player';

function App() {
  const currentProjectId = useRecoilValue(currentProjectIdState);
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [currentTrackList, setCurrentTrackList] = useRecoilState(currentTrackListState);
  const setCurrentCueList = useSetRecoilState(currentCueListState);
  const setPlayerPath = useSetRecoilState(playerPathState);

  const theme = useRecoilValue(themeState);
  const accent = useRecoilValue(accentState);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  useEffect(() => {
    setCurrentProject(null);
    setCurrentTrackList(null);
    setCurrentCueList(null);

    setPlayerPath('');
  }, [currentProjectId]);

  return currentProject === null || currentTrackList === null ? (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LoadingContainer />
    </div>
  ) : (
    <Base />
  );
}

export default App;
