import { ChangeEvent, useRef } from 'react';
import { ReflexContainer, ReflexSplitter, ReflexElement, HandlerProps } from 'react-reflex';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  playerDurationState,
  playerPathState,
  playerPlayingState,
  playerProgressState,
  requestedPlayerProgressState,
} from '../store/player';
import Player from './player/Player';
import Timetable from './timetable/Timetable';
import {
  editorElementSizesState,
  editorShowMsState,
  editorShowTimelineState,
} from '../store/states';
import ReactSlider from 'react-slider';
import FileDrop from './FileDrop';
import {
  Icon10Left,
  Icon10Right,
  IconArrowsRightLeft,
  IconFileUpload,
  IconPause,
  IconPlay,
  IconSubtitle,
} from './Icons';
import TimeInput from './TimeInput';
import { classNames } from '../util/layout';
import EditorPanel from './EditorPanel';
import { EditorElementKeys } from '../util/constants';
import Button from './Button';
import { importExportModalOpenState, tracksModalOpenState } from '../store/modals';
import { currentTrackSelector } from '../store/selectors';
import { accentState } from '../store/theme';

type Props = {
  hidden?: boolean;
};

const Editor: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);
  const currentTrack = useRecoilValue(currentTrackSelector);
  const [editorElementSizes, setEditorElementSizes] = useRecoilState(editorElementSizesState);
  const [playerProgress, setPlayerProgress] = useRecoilState(playerProgressState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);
  const playerDuration = useRecoilValue(playerDurationState);
  const [playerPath, setPlayerPath] = useRecoilState(playerPathState);
  const showMs = useRecoilValue(editorShowMsState);
  const showTimeline = useRecoilValue(editorShowTimelineState);
  const pickerRef = useRef<HTMLInputElement | null>(null);
  const setTracksModalOpen = useSetRecoilState(tracksModalOpenState);
  const setImportExportModalOpen = useSetRecoilState(importExportModalOpenState);
  const setRequestedPlayerProgress = useSetRecoilState(requestedPlayerProgressState);

  const handleElementResize = (event: HandlerProps) => {
    const { name, flex } = event.component.props;

    if (name && flex !== undefined) {
      setEditorElementSizes({
        ...editorElementSizes,
        [name]: flex,
      });
    }
  };

  const handlePickerClick = () => {
    if (pickerRef.current) {
      pickerRef.current.click();
    }
  };

  const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) setPlayerPath(URL.createObjectURL(e.target.files[0]));
  };

  // TODO: deprecate
  // const handleConnect = () => {
  //   const vid = document.getElementById("myvideo");

  //   if (vid) {
  //     const subobj = new Blob([subsvtt], { type: "text/vtt" });
  //     const url = (URL || webkitURL).createObjectURL(subobj);
  //     const track = document.createElement("track");
  //     console.log(subobj);
  //     track.kind = "captions";
  //     track.label = "English";
  //     track.srclang = "en";
  //     track.src = url;
  //     track.default = true;
  //     vid.appendChild(track);
  //   }
  // };

  const handleSeek = (value: number) => {
    setRequestedPlayerProgress(value);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex bg-slate-1 border-b border-slate-6 px-2">
        {/* TODO: move to ControlBar.tsx */}
        <div className="flex flex-1 items-center gap-1 py-2 text-slate-11">
          <a
            className="cursor-pointer hover:text-slate-12"
            onClick={() => setPlayerPlaying(!playerPlaying)}
          >
            {playerPlaying ? (
              <IconPause width={22} height={22} />
            ) : (
              <IconPlay width={22} height={22} />
            )}
          </a>
          <a
            className="cursor-pointer hover:text-slate-12"
            onClick={() => handleSeek(playerProgress - 10)}
          >
            <Icon10Left width={22} height={22} />
          </a>
          <a
            className="cursor-pointer hover:text-slate-12"
            onClick={() => handleSeek(playerProgress + 10)}
          >
            <Icon10Right width={22} height={22} />
          </a>
          <ReactSlider
            className={classNames(
              `w-full max-w-lg h-6 mx-2 [&>.thumb]:bg-slate-9 [&>.thumb]:hover:bg-slate-10 [&>.thumb]:outline-none [&>.thumb]:top-1 [&>.thumb]:h-4 [&>.thumb]:w-3 [&>.track]:top-1.5 [&>.track]:h-3 [&>.track]:bg-slate-3 [&>_.track-0]:bg-emerald-500`,
              playerPath ? '' : '[&>.thumb]:hidden [&>.track]:bg-slate-2'
            )}
            thumbClassName="thumb"
            trackClassName="track"
            min={0}
            max={playerDuration}
            value={playerProgress}
            onChange={handleSeek}
          />
          <TimeInput
            className="text-center w-24 outline-none py-0.5 border border-slate-7 text-slate-12 bg-slate-2 disabled:bg-slate-5 disabled:cursor-not-allowed"
            disabled={playerPath ? false : true}
            valueMs={playerProgress * 1000}
            callback={(value: number) => handleSeek(value / 1000)}
          />
          <span className="px-2">/</span>
          <input
            className="text-center w-24 outline-none py-0.5 border border-slate-7 text-slate-12 bg-slate-5 cursor-not-allowed"
            disabled
            value={new Date(playerDuration * 1000).toISOString().substring(12, showMs ? 23 : 19)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button className="text-sm" onClick={() => setTracksModalOpen(true)}>
            <span>
              <IconSubtitle />
              {currentTrack ? `Track: ${currentTrack.name}` : 'Tracks'}
            </span>
          </Button>

          <Button className="text-sm" onClick={handlePickerClick}>
            <span>
              <IconFileUpload />
              Select Video
            </span>
            <input
              style={{ display: 'none' }}
              type="file"
              ref={pickerRef}
              onChange={handlePickerChange}
            />
          </Button>

          <Button className="text-sm" onClick={() => setImportExportModalOpen(true)}>
            <span>
              <IconArrowsRightLeft />
              Import / Export
            </span>
          </Button>
        </div>
      </div>
      <ReflexContainer
        orientation="horizontal"
        className="justify-start items-stretch content-stretch flex relative w-full h-full flex-col min-h-[1px]"
      >
        <ReflexElement className="relative overflow-auto h-full w-full">
          <ReflexContainer
            orientation="vertical"
            className="justify-start items-stretch content-stretch flex relative w-full h-full flex-row min-w-[1px]"
          >
            <ReflexElement
              className="relative overflow-auto h-full w-full"
              name={EditorElementKeys.Player}
              flex={editorElementSizes[EditorElementKeys.Player]}
              onStopResize={handleElementResize}
            >
              <div className="h-full w-full overflow-hidden bg-slate-1 text-slate-12">
                {playerPath ? <Player path={playerPath} /> : <FileDrop />}
              </div>
            </ReflexElement>
            <ReflexSplitter className="h-full w-2 relative bg-slate-3 before:bg-emerald-500 cursor-col-resize before:absolute before:top-0 before:left-0 before:z-30 before:h-full hover:before:-left-0.5 hover:before:-right-0.5 active:before:-left-0.5 active:before:-right-0.5" />
            <ReflexElement
              name={EditorElementKeys.EditorPanel}
              className="relative overflow-auto h-full w-full"
            >
              <div className="h-full w-full overflow-hidden bg-slate-1 text-slate-12">
                <EditorPanel />
              </div>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
        {showTimeline ? (
          <ReflexSplitter className="w-full h-2 relative bg-slate-3 before:bg-emerald-500 cursor-row-resize before:absolute before:top-0 before:left-0 before:z-30 before:w-full hover:before:-top-0.5 hover:before:-bottom-0.5 active:before:-top-0.5 active:before:-bottom-0.5" />
        ) : (
          ''
        )}
        {showTimeline ? (
          <ReflexElement
            name={EditorElementKeys.Timeline}
            flex={editorElementSizes[EditorElementKeys.Timeline]}
            onStopResize={handleElementResize}
            className="relative overflow-auto h-full w-full"
          >
            <div className="h-full w-full overflow-hidden bg-slate-1 text-slate-12">
              <p style={{ textAlign: 'center' }}>Timeline</p>
            </div>
          </ReflexElement>
        ) : (
          ''
        )}
        <ReflexSplitter className="w-full h-2 relative bg-slate-3 before:bg-emerald-500 cursor-row-resize before:absolute before:top-0 before:left-0 before:z-30 before:w-full hover:before:-top-0.5 hover:before:-bottom-0.5 active:before:-top-0.5 active:before:-bottom-0.5" />
        <ReflexElement
          name={EditorElementKeys.Timetable}
          flex={editorElementSizes[EditorElementKeys.Timetable]}
          onStopResize={handleElementResize}
          className="relative overflow-auto h-full w-full"
        >
          <div
            className="h-full w-full overflow-hidden bg-slate-1 text-slate-12"
            style={{ overflowY: 'auto' }}
          >
            <Timetable handleSeek={handleSeek} />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default Editor;
