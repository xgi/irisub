import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { ReactNode, useEffect } from "react";
import {
  currentProjectIdState,
  currentTrackIdState,
  gatewayConnectedState,
  userIdState,
} from "../../store/states";
import LoadingPage from "../LoadingPage";
import { gateway } from "../../services/gateway";
import { nanoid } from "nanoid";
import { Irisub } from "irisub-common";

type Props = {
  children?: ReactNode;
};

const GatewayRoot: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

  const [gatewayConnected, setGatewayConnected] = useRecoilState(gatewayConnectedState);

  const createNewProject = async () => {
    console.log("Creating new project...");

    const newProject: Irisub.Project = {
      id: nanoid(),
      title: "my cool project",
    };
    await gateway.upsertProject(newProject);

    const newTrack: Irisub.Track = {
      id: nanoid(),
      name: "my cool track",
    };
    await gateway.upsertTrack(newProject.id, newTrack);

    const introCueTextList = [
      "Welcome to Irisub! This is the first subtitle.",
      "To get started, click Select Video to choose a file or video from YouTube/Vimeo.",
      "You can resize the panels on this page by clicking and dragging the dividers.",
      "Split text into multiple lines with Shift+Enter.\nThis is the second line.",
      "This session is temporary by default. Click Save Workspace in the top right to keep your work.",
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
    // TODO: get an existing project or create new one (gateway call)
    // need to validate user has access on it as well
    if (currentProjectId === null) {
      createNewProject();
      return;
    }

    // TODO: get an existing track or create new one (gateway call)
    // prefer to use one in localstorage, but need to validate it is in the project
    // if (currentTrackId === null) {
    //   await gateway.getTracks(currentProjectId).then((data) => setCurrentTrackId(data.trackIds[0]));
    // }

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

  return gatewayConnected ? <>{props.children}</> : <LoadingPage />;
};

export default GatewayRoot;
