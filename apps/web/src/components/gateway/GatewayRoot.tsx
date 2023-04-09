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
import { nanoid } from 'nanoid';
import { Irisub } from '@irisub/shared';

type Props = {
  children?: ReactNode;
};

const GatewayRoot: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

  const [gatewayConnected, setGatewayConnected] = useRecoilState(gatewayConnectedState);

  const createNewProject = async () => {
    console.log('Creating new project...');

    const newProject: Irisub.Project = {
      id: nanoid(),
      title: 'my cool project',
    };
    await gateway.upsertProject(newProject);

    const newTrack: Irisub.Track = {
      id: nanoid(),
      name: 'my cool track',
      language: null,
    };
    await gateway.upsertTrack(newProject.id, newTrack);

    const introCueTextList = [
      'Welcome to Irisub! This is the first subtitle.',
      'To get started, click Select Video to choose a file or video from YouTube/Vimeo.',
      'You can resize the panels on this page by clicking and dragging the dividers.',
      'Split text into multiple lines with Shift+Enter.\nThis is the second line.',
      'This session is temporary by default. Click Save Workspace in the top right to keep your work.',
    ];
    const newCueList: Irisub.Cue[] = introCueTextList.map((text, index) => ({
      id: nanoid(),
      text: text,
      start_ms: index * 3000,
      end_ms: (index + 1) * 3000,
    }));
    await gateway.upsertCues(newProject.id, newTrack.id, newCueList);

    setCurrentProjectId(newProject.id);
    setCurrentTrackId(newTrack.id);
  };

  const init = async () => {
    if (currentProjectId === null) {
      createNewProject();
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
  }, [userId, currentProjectId]);

  return gatewayConnected ? <>{props.children}</> : <LoadingContainer />;
};

export default GatewayRoot;
