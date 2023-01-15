import Modal from "./Modal";
import { useRecoilState } from "recoil";
import { currentTrackIndexState } from "../store/states";
import { IconDuplicate, IconTrash, IconX } from "./Icons";
import styles from "../styles/components/TracksModal.module.scss";
import { useEffect } from "react";
import { tracksModalOpenState } from "../store/modals";
import { currentTrackListState } from "../store/tracks";
import { Irisub } from "irisub-common";
import { classNames } from "../util/layout";
import ReactTooltip from "react-tooltip";

const DEFAULT_TRACK: Irisub.Track = {
  index: 0,
};

type Props = {
  onClose?: () => void;
};

const TracksModal: React.FC<Props> = (props: Props) => {
  const [tracksModalOpen, setTracksModalOpen] = useRecoilState(tracksModalOpenState);
  const [currentTrackList, setCurrentTrackList] = useRecoilState(currentTrackListState);
  const [currentTrackIndex, setCurrentTrackIndex] = useRecoilState(currentTrackIndexState);

  useEffect(() => {
    if (currentTrackList && currentTrackList.length === 0) {
      setCurrentTrackList([DEFAULT_TRACK]);
    }
  }, [currentTrackList]);

  const close = () => {
    setTracksModalOpen(false);
    if (props.onClose) props.onClose();
  };

  const changeTrack = (trackIndex: number) => {
    if (trackIndex === currentTrackIndex) return;

    setCurrentTrackIndex(trackIndex);
    // setCurrentEventList(null);
  };

  const newTrack = () => {
    let maxIndex = 0;
    if (currentTrackList) {
      for (let track of currentTrackList) {
        if (track.index > maxIndex) maxIndex = track.index;
      }
    }

    setCurrentTrackList([...(currentTrackList || [{ index: 0 }]), { index: maxIndex + 1 }]);
    changeTrack(maxIndex + 1);
  };

  const renderTrack = (track: Irisub.Track) => {
    const tooltipIdDelete = `tooltip-track-${track.index}-delete`;
    const tooltipIdDuplicate = `tooltip-track-${track.index}-duplicate`;

    return (
      <div
        key={track.index}
        className={classNames(styles.track, track.index === currentTrackIndex ? styles.active : "")}
        onClick={() => changeTrack(track.index)}
      >
        <button>
          <span>
            {track.index} - {track.name || "Unnamed track"} - {track.language || "No language"}
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
    let _tracks = currentTrackList || [];
    if (_tracks.length === 0) _tracks = [DEFAULT_TRACK];

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
