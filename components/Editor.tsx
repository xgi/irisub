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

type Props = {};

const Editor: React.FC<Props> = (props: Props) => {
  const database = useRecoilValue(databaseState);
  const [currentEventList, setCurrentEventList] = useRecoilState(
    currentEventListState
  );
  const [playerProgress, setPlayerProgress] =
    useRecoilState(playerProgressState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);
  const playerDuration = useRecoilValue(playerDurationState);
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [playerPath, setPlayerPath] = useRecoilState(playerPathState);
  const playerRef = useRef<ReactPlayer | null>(null);
  const pickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (database) {
      database
        .getAll(DB_STORES.EVENT)
        .then((events) => setCurrentEventList(events));
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

  const handleConnect = () => {
    const vid = document.getElementById("myvideo");

    if (vid) {
      const subobj = new Blob([subsvtt], { type: "text/vtt" });
      const url = (URL || webkitURL).createObjectURL(subobj);
      const track = document.createElement("track");
      console.log(subobj);
      track.kind = "captions";
      track.label = "English";
      track.srclang = "en";
      track.src = url;
      track.default = true;
      vid.appendChild(track);
    }
  };

  const handleSeek = (value: number) => {
    setPlayerProgress(value);

    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controlBar}>
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
            className={styles.horizontalSlider}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            min={0}
            max={playerDuration}
            value={playerProgress}
            onChange={handleSeek}
          />
          <span style={{ fontFamily: "monospace", fontWeight: "600" }}>
            {new Date(playerProgress * 1000).toISOString().substring(12, 23)} /{" "}
            {new Date(playerDuration * 1000).toISOString().substring(12, 23)}
          </span>
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
              <ReflexContainer orientation="horizontal">
                <ReflexElement>
                  <div className={styles.pane}>
                    <button onClick={handleConnect}>connect</button>
                    <p>
                      progress:{" "}
                      {new Date(playerProgress * 1000)
                        .toISOString()
                        .substring(12, 23)}
                    </p>
                    <button
                      onClick={() => {
                        const myNewProject: Irisub.Project = {
                          id: uuidv4(),
                          title: "my new project",
                        };
                        setCurrentProject(myNewProject);
                      }}
                    >
                      create project
                    </button>
                    <button
                      onClick={() => {
                        if (currentProject) {
                          setCurrentProject({
                            ...currentProject,
                            title: "some different title",
                          });
                        }
                      }}
                    >
                      modify project
                    </button>
                    <button
                      onClick={async () => {
                        const database = await initDb();
                        database.getAll(DB_STORES.PROJECT).then((projects) => {
                          console.log(
                            `Found ${projects.length} projects in persistant store:`
                          );
                          projects.forEach((project) => console.log(project));
                        });
                      }}
                    >
                      list all projects
                    </button>
                    <button
                      onClick={async () => {
                        const database = await initDb();
                        database.getAll(DB_STORES.EVENT).then((events) => {
                          console.log(
                            `Found ${events.length} events in persistant store:`
                          );
                          events.forEach((event) => console.log(event));
                        });
                      }}
                    >
                      list all events
                    </button>
                    <button
                      onClick={async () => {
                        const database = await initDb();
                        Array(32)
                          .fill(null)
                          .forEach(async () => {
                            const result = await database.put(DB_STORES.EVENT, {
                              id: uuidv4(),
                              text: "",
                            });
                            console.log(result);
                          });
                      }}
                    >
                      add some events
                    </button>
                  </div>
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement>
                  <div className={styles.pane}>
                    <TextEditor />
                  </div>
                </ReflexElement>
              </ReflexContainer>
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
