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

type Props = {
  children?: ReactNode;
};

const GatewayRoot: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

  const [gatewayConnected, setGatewayConnected] = useRecoilState(gatewayConnectedState);

  useEffect(() => {
    setGatewayConnected(false);

    if (userId !== null) {
      // TODO: get an existing project or create new one (gateway call)
      // need to validate user has access on it as well
      const projectId = "fakeprojectid";
      if (currentProjectId === null) {
        setCurrentProjectId(projectId);
        return;
      }

      // TODO: get an existing track or create new one (gateway call)
      // prefer to use one in localstorage, but need to validate it is in the project
      setCurrentTrackId("faketrackid");

      console.log(`Gateway: connecting to event source for project ${projectId}`);
      gateway.connectEventSource(projectId).then(() => {
        setGatewayConnected(true);
      });
    }
  }, [userId, currentProjectId]);

  return gatewayConnected ? <>{props.children}</> : <LoadingPage />;
};

export default GatewayRoot;
