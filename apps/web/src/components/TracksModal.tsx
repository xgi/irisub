import Modal from './Modal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentCueListState,
  currentProjectIdState,
  currentTrackIdState,
  currentTrackListState,
} from '../store/states';
import { IconCheck, IconChevronDown, IconPencil, IconTrash, IconX } from './Icons';
import Button from './Button';
import { useState } from 'react';
import { tracksModalOpenState } from '../store/modals';
import { Irisub } from '@irisub/shared';
import { LANGUAGES } from '@irisub/shared';
import { classNames } from '../util/layout';
import { nanoid } from 'nanoid';
import { gateway } from '../services/gateway';
import { Tooltip } from 'react-tooltip';
import * as Select from '@radix-ui/react-select';
import { accentState } from '../store/theme';

type Props = {
  onClose?: () => void;
};

const TracksModal: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);
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
        className={classNames(
          'w-full cursor-pointer flex items-center justify-between text-left gap-4 my-1 mx-0 px-4 py-2 border',
          track.id === currentTrackId ? `border-${accent}-600` : 'border-slate-6'
        )}
        onClick={() => changeTrack(track.id)}
      >
        {promptDeleteTrackId === track.id ? (
          <>
            <span>
              Delete <span className={`text-${accent}-500 font-semibold`}>{track.name}</span>?
            </span>
            <div className="inline-flex gap-2">
              <Button
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
            <div className="inline-flex items-center gap-4 cursor-pointer text-left text-sm border-none text-slate-12">
              <Select.Root
                value={track.languageCode || ''}
                onValueChange={(value) => updateTrack(track.id, { languageCode: value })}
              >
                <Select.Trigger className="inline-flex items-center justify-center gap-1 w-32 h-8 cursor-pointer outline-none border border-slate-6 text-slate-12 bg-slate-3 p-2 hover:bg-slate-4 hover:border-slate-8 focus:bg-slate-4 focus:border-slate-8">
                  <Select.Value>
                    {track.languageCode && track.languageCode in LANGUAGES
                      ? LANGUAGES[track.languageCode]
                      : ''}
                  </Select.Value>
                  <Select.Icon className="text-slate-12">
                    <IconChevronDown />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal className="z-50">
                  <Select.Content className=" bg-slate-6" position="popper">
                    <Select.Viewport className="p-px w-44 max-h-96 overflow-y-scroll">
                      <Select.Group>
                        {Object.entries(LANGUAGES)
                          .sort((a, b) => a[1].localeCompare(b[1]))
                          .map((language) => (
                            <Select.Item
                              className="cursor-pointer select-none flex items-center text-sm h-7 pl-6 pt-2 pb-2 relative text-slate-11 bg-slate-1 data-[highlighted]:outline-none data-[highlighted]:text-slate-12 data-[highlighted]:bg-slate-4"
                              key={language[0]}
                              value={language[0]}
                            >
                              <Select.ItemText>{language[1]}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
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
                    className="py-0.5 px-1 inline bg-slate-3 text-slate-12 outline outline-slate-7 rounded-sm border-none"
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
            <div className="inline-flex gap-2">
              <button
                className="text-slate-11 hover:text-slate-12"
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
                className="text-slate-11 hover:text-red-500"
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
      <Button className="w-11/12" onClick={newTrack}>
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
      <div className="w-full text-center">
        <div className="bg-slate-2 border-b border-slate-6 px-5 py-3 flex items-center justify-between">
          <h3 className="text-slate-12 text-lg m-0 font-bold">Tracks</h3>
          <button className="text-slate-11 hover:text-slate-12 bg-transparent h-6 w-6 border-none cursor-pointer">
            <IconX width={22} height={22} onClick={() => close()} />
          </button>
        </div>

        <div className="flex flex-col overflow-y-scroll max-h-96 my-1 mr-0 ml-5 pr-1">
          {renderTrackList()}
        </div>

        <div className="text-slate-11 bg-slate-2 px-4 py-2 font-medium text-xs border-t border-slate-6">
          {renderAddButton()}
        </div>
      </div>
    </Modal>
  );
};

export default TracksModal;
