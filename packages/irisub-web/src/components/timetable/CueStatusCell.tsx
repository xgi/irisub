import { Irisub } from "irisub-common";
import { useRecoilState } from "recoil";
import styles from "../../styles/components/CueStatusCell.module.scss";
import { classNames } from "../../util/layout";
import { playerProgressState, playerPlayingState } from "../../store/player";

type Props = {
  cue: Irisub.Cue;
  handleSeek: (value: number) => void;
};

const CueStatusCell: React.FC<Props> = (props: Props) => {
  const [playerProgress, setPlayerProgress] = useRecoilState(playerProgressState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);

  const playerProgressMs = playerProgress * 1000;
  const active = playerProgressMs >= props.cue.start_ms && playerProgressMs < props.cue.end_ms;

  if (active) {
    return (
      <td
        className={styles.iconCell}
        onClick={() => {
          if (!playerPlaying) props.handleSeek(props.cue.start_ms / 1000);
          setPlayerPlaying(!playerPlaying);
        }}
      >
        <span
          className={classNames(styles.statusIcon, playerPlaying ? styles.playing : styles.paused)}
        >
          ➤
        </span>
      </td>
    );
  }
  return (
    <td
      className={styles.iconCell}
      onClick={() => {
        setPlayerPlaying(false);
        props.handleSeek(props.cue.start_ms / 1000);
      }}
    >
      <span className={classNames(styles.statusIcon, styles.jump)}>↪</span>
    </td>
  );
};

export default CueStatusCell;
