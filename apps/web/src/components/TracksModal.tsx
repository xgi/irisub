import Modal from './Modal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentCueListState,
  currentProjectIdState,
  currentTrackIdState,
  currentTrackListState,
} from '../store/states';
import { IconCheck, IconPencil, IconTrash, IconX } from './Icons';
import Button from './Button';
import styles from '../styles/components/TracksModal.module.scss';
import { useState } from 'react';
import { tracksModalOpenState } from '../store/modals';
import { Irisub } from '@irisub/shared';
import { LANGUAGES } from '@irisub/shared';
import { classNames } from '../util/layout';
import { nanoid } from 'nanoid';
import { gateway } from '../services/gateway';
import { Tooltip } from 'react-tooltip';
import * as Select from '@radix-ui/react-select';

type Props = {
  onClose?: () => void;
};

const TracksModal: React.FC<Props> = (props: Props) => {
  const currentProjectId = useRecoilValue(currentProjectIdState);
  const [tracksModalOpen, setTracksModalOpen] = useRecoilState(tracksModalOpenState);
  const [currentTrackList, setCurrentTrackList] = useRecoilState(currentTrackListState);
  const setCurrentCueList = useSetRecoilState(currentCueListState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

  const [renamingTrackId, setRenamingTrackId] = useState<string>();
  const [promptDeleteTrackId, setPromptDeleteTrackId] = useState<string>();
  const [tempTrackName, setTempTrackName] = useState<string>();

  const close = () => {
    setTracksModalOpen(false);
    if (props.onClose) props.onClose();
  };

  const changeTrack = (trackId: string) => {
    if (trackId === currentTrackId) return;

    setCurrentTrackId(trackId);
    setCurrentCueList(null);
  };

  const handleRename = () => {
    if (!renamingTrackId) return;

    updateTrack(renamingTrackId, { name: tempTrackName });
    setRenamingTrackId(undefined);
  };

  const updateTrack = (trackId: string, data: { languageCode?: string; name?: string }) => {
    if (!currentTrackList) return;

    const _tracks: Irisub.Track[] = [...currentTrackList].map((track) => {
      if (trackId === track.id) {
        return {
          ...track,
          languageCode: data.languageCode || track.languageCode,
          name: data.name || track.name,
        };
      }
      return track;
    });
    setCurrentTrackList(_tracks);
  };

  const newTrack = async () => {
    if (!currentProjectId) return;

    const newTrack: Irisub.Track = {
      id: nanoid(),
      name: 'Unnamed Track',
      languageCode: 'en',
    };
    const trackRes = await gateway.upsertTrack(currentProjectId, newTrack);

    const cue = {
      id: nanoid(),
      text: 'This is the first subtitle in your new track.',
      start_ms: 0,
      end_ms: 3000,
    };
    await gateway.upsertCues(currentProjectId, newTrack.id, [cue]);

    setCurrentTrackList(
      currentTrackList ? [...currentTrackList, trackRes.track] : [trackRes.track]
    );
    changeTrack(trackRes.track.id);
  };

  const renderTrack = (track: Irisub.Track) => {
    return (
      <div
        key={track.id}
        className={classNames(styles.track, track.id === currentTrackId ? styles.active : '')}
        onClick={() => changeTrack(track.id)}
      >
        {promptDeleteTrackId === track.id ? (
          <>
            <span>
              Delete <span className={styles.highlight}>{track.name}</span>?
            </span>
            <div className={styles.deleteConfirmationActions}>
              <Button
                className={styles.delete}
                accent
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO delete & change active track if necessary
                  setPromptDeleteTrackId(undefined);
                }}
              >
                Delete
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setPromptDeleteTrackId(undefined);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.info}>
              <Select.Root
                value={track.languageCode || ''}
                onValueChange={(value) => updateTrack(track.id, { languageCode: value })}
              >
                <Select.Trigger className={styles.selectTrigger}>
                  <Select.Value>
                    {track.languageCode && track.languageCode in LANGUAGES
                      ? LANGUAGES[track.languageCode]
                      : ''}
                  </Select.Value>
                </Select.Trigger>

                <Select.Portal className={styles.selectPortal}>
                  <Select.Content className={styles.selectContent} position="popper">
                    <Select.Viewport className={styles.selectViewport}>
                      <Select.Group>
                        {Object.entries(LANGUAGES)
                          .sort((a, b) => a[1].localeCompare(b[1]))
                          .map((language) => (
                            <Select.Item
                              key={language[0]}
                              value={language[0]}
                              className={styles.selectItem}
                            >
                              <Select.ItemText>{language[1]}</Select.ItemText>
                              <Select.ItemIndicator className={styles.selectItemIndicator}>
                                <IconCheck />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              {renamingTrackId === track.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRename();
                  }}
                >
                  <input
                    value={tempTrackName}
                    onChange={(e) => {
                      setTempTrackName(e.target.value);
                    }}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => handleRename()}
                    autoFocus
                  />
                </form>
              ) : (
                <span>{track.name || 'Unnamed track'}</span>
              )}
            </div>
            <div className={styles.actions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRenamingTrackId(track.id);
                  setTempTrackName(track.name || '');
                }}
                data-tooltip-id="tt-track-modal-rename-track"
                data-tooltip-content="Rename Track"
              >
                <IconPencil width={20} height={20} />
              </button>
              <Tooltip id="tt-track-modal-rename-track" className="tooltip" place="right" />

              <button
                className={styles.delete}
                onClick={(e) => {
                  e.stopPropagation();
                  setPromptDeleteTrackId(track.id);
                }}
                data-tooltip-id="tt-track-modal-delete-track"
                data-tooltip-content="Delete Track"
              >
                <IconTrash width={20} height={20} />
              </button>
              <Tooltip id="tt-track-modal-delete-track" className="tooltip" place="right" />
            </div>
          </>
        )}
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
          <h3>Tracks</h3>
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
