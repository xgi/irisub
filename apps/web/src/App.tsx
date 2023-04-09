import './styles/global/colors.scss';
import './styles/global/general.scss';
import './styles/global/scrollbar.scss';
import './styles/global/reflex.scss';
import './styles/global/player.scss';
import './styles/global/tooltip.scss';
import { useRecoilValue } from 'recoil';
import Base from './components/Base';

import { useEffect } from 'react';
import { currentProjectState, currentTrackListState } from './store/states';
import { themeState, accentState } from './store/theme';
import LoadingContainer from './components/LoadingContainer';

function App() {
  const currentProject = useRecoilValue(currentProjectState);
  const currentTrackList = useRecoilValue(currentTrackListState);
  const theme = useRecoilValue(themeState);
  const accent = useRecoilValue(accentState);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  return currentProject === null || currentTrackList === null ? (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LoadingContainer />
    </div>
  ) : (
    <Base />
  );
}

export default App;
