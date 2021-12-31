// import styles from "../styles/components/Something.module.css";

import { ClassAttributes, useCallback, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerProgressState } from "../store/player";

type ProgressEvent = {
  playedSeconds: number;
  played: number;
  loadedSeconds: number;
  loaded: number;
};

type Props = {
  path: string | undefined;
};

const Player: React.FC<Props> = (props: Props) => {
  const playerProgress = useRecoilValue(playerProgressState);
  const setPlayerProgress = useSetRecoilState(playerProgressState);
  const playerRef = useCallback((node: ReactPlayer) => {
    console.log("here");
    console.log(node);
    // if (node !== null) {
    //   console.log(node.getInternalPlayer());
    // }
  }, []);
  // const playerRef = useRef<ReactPlayer>(null);

  return props.path ? (
    <ReactPlayer
      ref={playerRef}
      url={props.path}
      pip={false}
      controls
      progressInterval={100}
      height={"100%"}
      width={"100%"}
      onProgress={(e: ProgressEvent) => setPlayerProgress(e.playedSeconds)}
    />
  ) : (
    <></>
  );
};

export default Player;
