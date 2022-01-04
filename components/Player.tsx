import { createRef, useCallback, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerProgressState } from "../store/player";
import styles from "../styles/components/Player.module.scss";

type ProgressEvent = {
  playedSeconds: number;
  played: number;
  loadedSeconds: number;
  loaded: number;
};

const VIDEO_ELEMENT_ID = "myvideo";

type Props = {
  path: string | undefined;
};

const Player: React.FC<Props> = (props: Props) => {
  const playerProgress = useRecoilValue(playerProgressState);
  const setPlayerProgress = useSetRecoilState(playerProgressState);
  const playerRef = useCallback((node: ReactPlayer) => {
    if (node !== null) {
      console.log(node.getInternalPlayer());
    }
  }, []);

  return props.path ? (
    <ReactPlayer
      ref={playerRef}
      url={props.path}
      pip={false}
      controls
      progressInterval={100}
      height={"auto"}
      width={"100%"}
      onProgress={(e: ProgressEvent) => setPlayerProgress(e.playedSeconds)}
      config={{
        file: {
          attributes: {
            id: VIDEO_ELEMENT_ID,
          },
        },
      }}
    />
  ) : (
    <></>
  );
};

export default Player;
