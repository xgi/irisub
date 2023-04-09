import Modal from './Modal';
import { useRecoilState } from 'recoil';
import { currentCueListState, currentTrackIdState, currentTrackListState } from '../store/states';
import { IconDuplicate, IconTrash, IconX } from './Icons';
import styles from '../styles/components/TracksModal.module.scss';
import { useEffect } from 'react';
import { tracksModalOpenState } from '../store/modals';
import { Irisub } from '@irisub/shared';
import { classNames } from '../util/layout';
import ReactTooltip from 'react-tooltip';

type Props = {
  onClose?: () => void;
};

const TracksModal: React.FC<Props> = (props: Props) => {
  const [tracksModalOpen, setTracksModalOpen] = useRecoilState(tracksModalOpenState);
  const [currentTrackList, setCurrentTrackList] = useRecoilState(currentTrackListState);
  const [currentCueList, setCurrentCueList] = useRecoilState(currentCueListState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

  useEffect(() => {
    if (currentTrackList && currentTrackList.length === 0) {
      // setCurrentTrackList([DEFAULT_TRACK]);
    }
  }, [currentTrackList]);

  const close = () => {
    setTracksModalOpen(false);
    if (props.onClose) props.onClose();
  };

  const changeTrack = (trackId: string) => {
    if (trackId === currentTrackId) return;

    setCurrentTrackId(trackId);
    setCurrentCueList(null);
    // setCurrentEventList(null);
  };

  const newTrack = () => {
    // let maxIndex = 0;
    // if (currentTrackList) {
    //   for (const track of currentTrackList) {
    //     if (track.index > maxIndex) maxIndex = track.index;
    //   }
    // }
    // setCurrentTrackList([...(currentTrackList || [{ index: 0 }]), { index: maxIndex + 1 }]);
    // changeTrack(maxIndex + 1);
  };

  const renderTrack = (track: Irisub.Track) => {
    const tooltipIdDelete = `tooltip-track-${track.id}-delete`;
    const tooltipIdDuplicate = `tooltip-track-${track.id}-duplicate`;

    return (
      <div
        key={track.id}
        className={classNames(styles.track, track.id === currentTrackId ? styles.active : '')}
        onClick={() => changeTrack(track.id)}
      >
        <button>
          <span>
            {track.id} - {track.name || 'Unnamed track'} - {track.language || 'No language'}
          </span>
        </button>
        <div className={styles.actions}>
          <IconDuplicate width={20} height={20} data-tip data-for={tooltipIdDuplicate} />
          <IconTrash width={20} height={20} data-tip data-for={tooltipIdDelete} />
        </div>

        <ReactTooltip
          id={tooltipIdDuplicate}
          className="tooltip"
          effect="solid"
          place="right"
          arrowColor="transparent"
        >
          <span>Duplicate</span>
        </ReactTooltip>
        <ReactTooltip
          id={tooltipIdDelete}
          className="tooltip"
          effect="solid"
          place="right"
          arrowColor="transparent"
        >
          <span>Delete</span>
        </ReactTooltip>
      </div>
    );
  };

  const renderAddButton = () => {
    // TODO: unenforced limit
    if (currentTrackList && currentTrackList.length >= 5) return undefined;

    return (
      <button className={styles.add} onClick={newTrack}>
        <span>
          <b>Add track</b>
        </span>
      </button>
    );
  };

  const renderTrackList = () => {
    const _tracks = currentTrackList || [];
    return _tracks.map((track) => renderTrack(track));
  };

  return !tracksModalOpen ? null : (
    <Modal isOpen={tracksModalOpen} handleClose={() => close()}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Track List</h3>
          <button className={styles.exit}>
            <IconX width={22} height={22} onClick={() => close()} />
          </button>
        </div>

        <div className={styles.inner}>
          {renderTrackList()}
          {renderAddButton()}
        </div>
      </div>
    </Modal>
  );
};

export default TracksModal;
