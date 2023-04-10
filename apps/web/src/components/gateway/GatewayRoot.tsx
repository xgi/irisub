import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ReactNode, useEffect } from 'react';
import {
  currentNavPageState,
  currentProjectIdState,
  currentTrackIdState,
  gatewayConnectedState,
  userIdState,
} from '../../store/states';
import LoadingContainer from '../LoadingContainer';
import { gateway } from '../../services/gateway';
import { NavPage } from '../../util/constants';

type Props = {
  children?: ReactNode;
};

const GatewayRoot: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [gatewayConnected, setGatewayConnected] = useRecoilState(gatewayConnectedState);
  const setCurrentNavPage = useSetRecoilState(currentNavPageState);

  const init = async () => {
    if (currentProjectId === null) {
      // TODO: should try to open an existing one first instead

      gateway.setupNewProject().then(({ project, track }) => {
        setCurrentProjectId(project.id);
        setCurrentTrackId(track.id);
      });
      return;
    }

    // Get tracks on the current project. This will also verify that we have authorization on it.
    const tracks = await gateway.getTracks(currentProjectId).catch(() => setCurrentProjectId(null));
    if (tracks === undefined) return;

    if (currentTrackId === null || !tracks.map((track) => track.id).includes(currentTrackId)) {
      setCurrentTrackId(tracks[0].id);
    }

    console.log(`Gateway: connecting to event source for project ${currentProjectId}`);
    gateway.connectEventSource(currentProjectId).then(() => {
      setGatewayConnected(true);
    });
  };

  useEffect(() => {
    setGatewayConnected(false);

    if (userId !== null) {
      init();
    }

    setCurrentNavPage(NavPage.Editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentProjectId]);

  return gatewayConnected ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{props.children}</>
  ) : (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LoadingContainer />
    </div>
  );
};

export default GatewayRoot;
