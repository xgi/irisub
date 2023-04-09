import './styles/global/colors.scss';
import './styles/global/general.scss';
import './styles/global/reflex.scss';
import './styles/global/player.scss';
import './styles/global/tooltip.scss';
import { useRecoilValue } from 'recoil';
import Base from './components/Base';

import { useEffect } from 'react';
import { currentCueListState, currentProjectState, currentTrackListState } from './store/states';
import { themeState, accentState } from './store/theme';
import LoadingPage from './components/LoadingPage';

function App() {
  const currentProject = useRecoilValue(currentProjectState);
  const currentTrackList = useRecoilValue(currentTrackListState);
  const currentCueList = useRecoilValue(currentCueListState);
  const theme = useRecoilValue(themeState);
  const accent = useRecoilValue(accentState);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  return currentProject === null || currentTrackList === null || currentCueList === null ? (
    <LoadingPage />
  ) : (
    <Base />
  );
}

export default App;
