import Modal from './Modal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentCueListState,
  currentProjectIdState,
  currentTrackIdState,
  currentTrackListState,
} from '../store/states';
import { IconDuplicate, IconTrash, IconX } from './Icons';
import Button from './Button';
import styles from '../styles/components/TracksModal.module.scss';
import { useEffect } from 'react';
import { tracksModalOpenState } from '../store/modals';
import { Irisub } from '@irisub/shared';
import { classNames } from '../util/layout';
import ReactTooltip from 'react-tooltip';
import { nanoid } from 'nanoid';
import { gateway } from '../services/gateway';

type Props = {
  onClose?: () => void;
};

const TracksModal: React.FC<Props> = (props: Props) => {
  const currentProjectId = useRecoilValue(currentProjectIdState);
  const [tracksModalOpen, setTracksModalOpen] = useRecoilState(tracksModalOpenState);
  const [currentTrackList, setCurrentTrackList] = useRecoilState(currentTrackListState);
  const setCurrentCueList = useSetRecoilState(currentCueListState);
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
  };

  const newTrack = async () => {
    if (!currentProjectId) return;

    const newTrack: Irisub.Track = {
      id: nanoid(),
      name: 'some new track',
      language: null,
    };
    gateway.upsertTrack(currentProjectId, newTrack).then((res) => {
      setCurrentTrackList(currentTrackList ? [...currentTrackList, res.track] : [res.track]);
      changeTrack(res.track.id);
    });
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
    return (
      <Button className={styles.add} onClick={newTrack}>
        <span>New Track</span>
      </Button>
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

        <div className={styles.inner}>{renderTrackList()}</div>

        <div className={styles.footer}>{renderAddButton()}</div>
      </div>
    </Modal>
  );
};

export default TracksModal;
