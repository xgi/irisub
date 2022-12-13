import { ForwardedRef, forwardRef } from "react";
import ReactPlayer from "react-player";
import { useRecoilState } from "recoil";
import { playerDurationState, playerPlayingState, playerProgressState } from "../store/player";
import styles from "../styles/components/Player.module.scss";

const VIDEO_ELEMENT_ID = "myvideo";

type Props = {
  path: string | undefined;
};

const Player = forwardRef((props: Props, playerRef: ForwardedRef<ReactPlayer>) => {
  const [playerProgress, setPlayerProgress] = useRecoilState(playerProgressState);
  const [playerDuration, setPlayerDuration] = useRecoilState(playerDurationState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);

  return props.path ? (
    <div>
      <ReactPlayer
        ref={playerRef}
        // url={"https://www.youtube.com/watch?v=aVZFRVHcQkM"}
        url={props.path}
        pip={false}
        controls={false}
        progressInterval={100}
        height={"auto"}
        width={"100%"}
        playing={playerPlaying}
        onProgress={(e) => setPlayerProgress(e.playedSeconds)}
        onDuration={(duration) => setPlayerDuration(duration)}
        onPause={() => setPlayerPlaying(false)}
        onPlay={() => setPlayerPlaying(true)}
        config={{
          file: {
            attributes: {
              id: VIDEO_ELEMENT_ID,
            },
          },
        }}
      />
    </div>
  ) : (
    <></>
  );
});

Player.displayName = "Player";
export default Player;
