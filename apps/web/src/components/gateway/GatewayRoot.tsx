import { useRecoilState, useRecoilValue } from 'recoil';

import { ReactNode, useEffect } from 'react';
import {
  currentProjectIdState,
  currentTrackIdState,
  gatewayConnectedState,
  userIdState,
} from '../../store/states';
import LoadingContainer from '../LoadingContainer';
import { gateway } from '../../services/gateway';

type Props = {
  children?: ReactNode;
};

const GatewayRoot: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [gatewayConnected, setGatewayConnected] = useRecoilState(gatewayConnectedState);

  const init = async () => {
    if (currentProjectId === null) {
      const existingData = await gateway.getProjects();
      const projects = existingData.owned;
      existingData.teams.forEach((team) => projects.push(...team.projects));

      if (projects.length > 0) {
        const project = projects.sort(
          (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        )[0];
        console.log(`Loading existing project: ${project.id}`);
        setCurrentProjectId(project.id);
        return;
      }

      gateway.setupNewProject().then(({ project, track }) => {
        setCurrentProjectId(project.id);
        setCurrentTrackId(track.id);
      });
      return;
    }

    // Get tracks on the current project. This will also verify that we have authorization on it.
    const tracksResp = await gateway
      .getTracks(currentProjectId)
      .catch(() => setCurrentProjectId(null));
    if (tracksResp === undefined) return;

    const tracks = tracksResp.tracks;
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
