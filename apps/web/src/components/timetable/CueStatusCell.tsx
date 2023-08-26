import { Irisub } from '@irisub/shared';
import { useRecoilState } from 'recoil';
import { playerProgressState, playerPlayingState } from '../../store/player';

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
        className="group cursor-pointer select-none text-center min-w-[2.2rem]"
        onClick={() => {
          if (!playerPlaying) props.handleSeek(props.cue.start_ms / 1000);
          setPlayerPlaying(!playerPlaying);
        }}
      >
        <span
          className={
            playerPlaying
              ? 'text-blue-500 group-hover:text-blue-700'
              : 'text-orange-500 group-hover:text-orange-700'
          }
        >
          ➤
        </span>
      </td>
    );
  }
  return (
    <td
      className="group cursor-pointer select-none text-center min-w-[2.2rem]"
      onClick={() => {
        setPlayerPlaying(false);
        props.handleSeek(props.cue.start_ms / 1000);
      }}
    >
      <span className="text-emerald-500 group-hover:text-emerald-700">↪</span>
    </td>
  );
};

export default CueStatusCell;
