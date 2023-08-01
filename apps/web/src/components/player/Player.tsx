import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  playerDurationState,
  playerPlayingState,
  playerProgressState,
  requestedPlayerProgressState,
} from '../../store/player';
import styles from '../../styles/components/Player.module.scss';
import SubtitleOverlay from './SubtitleOverlay';

const VIDEO_ELEMENT_ID = 'myvideo';

type Props = {
  path: string | undefined;
};

const Player: React.FC<Props> = (props: Props) => {
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const [playerProgress, setPlayerProgress] = useRecoilState(playerProgressState);
  const [playerDuration, setPlayerDuration] = useRecoilState(playerDurationState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);

  const requestedPlayerProgress = useRecoilValue(requestedPlayerProgressState);

  useEffect(() => {
    if (playerRef.current) {
      setPlayerProgress(requestedPlayerProgress);
      playerRef.current.seekTo(requestedPlayerProgress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedPlayerProgress]);

  return props.path ? (
    <div>
      <div className={styles.wrapper} ref={playerWrapperRef}>
        <SubtitleOverlay />
        <ReactPlayer
          ref={playerRef}
          // url={'https://www.youtube.com/watch?v=aVZFRVHcQkM'}
          url={props.path}
          pip={false}
          controls={false}
          progressInterval={100}
          height={'auto'}
          width={'100%'}
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
    </div>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};

export default Player;
