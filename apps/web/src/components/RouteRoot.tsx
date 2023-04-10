/* eslint-disable no-restricted-globals */
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentNavPageState, currentProjectIdState, currentTrackIdState } from '../store/states';
import { NavPage } from '../util/constants';
import { ReactNode, useEffect } from 'react';

type Props = {
  children?: ReactNode;
};

const RouteRoot: React.FC<Props> = (props: Props) => {
  const [currentNavPage, setCurrentNavPage] = useRecoilState(currentNavPageState);
  const setCurrentProjectId = useSetRecoilState(currentProjectIdState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);

  useEffect(() => {
    const currentWindowPath = window.location.pathname.split('/')[1];

    if (currentWindowPath === '') setCurrentNavPage(NavPage.Editor);
    if (currentWindowPath === 'projects') setCurrentNavPage(NavPage.Projects);
    if (currentWindowPath === 'settings') setCurrentNavPage(NavPage.Settings);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params['projectId']) setCurrentProjectId(params['projectId']);
    if (params['trackId']) setCurrentTrackId(params['trackId']);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentNavPage === NavPage.Editor) history.replaceState({}, 'editor', '/');
    if (currentNavPage === NavPage.Projects) history.replaceState({}, 'projects', '/projects');
    if (currentNavPage === NavPage.Settings) history.replaceState({}, 'settings', '/settings');
  }, [currentNavPage]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{props.children}</>;
};

export default RouteRoot;
