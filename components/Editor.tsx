import { ChangeEvent, useEffect, useRef } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import {
  playerDurationState,
  playerPathState,
  playerPlayingState,
  playerProgressState,
} from "../store/player";
import styles from "../styles/components/Editor.module.scss";
import Player from "./Player";
import TextEditor from "./TextEditor";
import Timetable from "./timetable/Timetable";
import subsvtt from "../lib/subsvtt";
import {
  currentEventListState,
  currentProjectState,
  databaseState,
} from "../store/states";
import { DB_STORES, initDb } from "../store/db";
import ReactSlider from "react-slider";
import ReactPlayer from "react-player";
import FileDrop from "./FileDrop";
import {
  Icon10Left,
  Icon10Right,
  IconFileUpload,
  IconPause,
  IconPlay,
} from "./Icons";
import TimeInput from "./TimeInput";
import { classNames } from "../util/layout";
import EditorPanel from "./EditorPanel";

type Props = {
  hidden?: boolean;
};

const Editor: React.FC<Props> = (props: Props) => {
  const database = useRecoilValue(databaseState);
  const [currentEventList, setCurrentEventList] = useRecoilState(
    currentEventListState
  );
  const [playerProgress, setPlayerProgress] =
    useRecoilState(playerProgressState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);
  const playerDuration = useRecoilValue(playerDurationState);
  const [playerPath, setPlayerPath] = useRecoilState(playerPathState);
  const playerRef = useRef<ReactPlayer | null>(null);
  const pickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (database) {
      database
        .getAll(DB_STORES.EVENT)
        .then((events) =>
          setCurrentEventList(events.sort((a, b) => a.index - b.index))
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [database]);

  const handlePickerClick = () => {
    if (pickerRef.current) {
      pickerRef.current.click();
    }
  };

  const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files)
      setPlayerPath(URL.createObjectURL(e.target.files[0]));
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
    setPlayerProgress(value);

    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  return (
    <div
      className={styles.container}
      style={props.hidden ? { display: "none" } : {}}
    >
      <div className={styles.controlBar}>
        {/* TODO: move to ControlBar.tsx */}
        <div className={styles.controlsGroup}>
          <a onClick={() => setPlayerPlaying(!playerPlaying)}>
            {playerPlaying ? <IconPause /> : <IconPlay />}
          </a>
          <a onClick={() => handleSeek(playerProgress - 10)}>
            <Icon10Left />
          </a>
          <a onClick={() => handleSeek(playerProgress + 10)}>
            <Icon10Right />
          </a>
          <ReactSlider
            className={classNames(
              styles.horizontalSlider,
              playerPath ? "" : styles.disabled
            )}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            min={0}
            max={playerDuration}
            value={playerProgress}
            onChange={handleSeek}
          />
          <TimeInput
            disabled={playerPath ? false : true}
            valueMs={playerProgress * 1000}
            callback={(value: number) => handleSeek(value / 1000)}
          />
          <span className={styles.timeDivider}>/</span>
          <input
            disabled
            value={new Date(playerDuration * 1000)
              .toISOString()
              .substring(12, 23)}
          />
        </div>
        <div className={styles.optionsGroup}>
          <button onClick={handlePickerClick}>
            <span>
              <IconFileUpload />
              Select Video
            </span>
            <input
              style={{ display: "none" }}
              type="file"
              ref={pickerRef}
              onChange={handlePickerChange}
            />
          </button>
        </div>
      </div>
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <ReflexContainer orientation="vertical">
            <ReflexElement>
              <div className={styles.pane}>
                {playerPath ? (
                  <Player path={playerPath} ref={playerRef} />
                ) : (
                  <FileDrop />
                )}
              </div>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement>
              <div className={styles.pane}>
                <EditorPanel />
              </div>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement>
          <div className={styles.pane} style={{ overflowY: "auto" }}>
            <Timetable />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default Editor;
