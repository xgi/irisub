import { useEffect, useState } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { playerProgressState } from "../store/player";
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

type Props = {};

const Something: React.FC<Props> = (props: Props) => {
  const database = useRecoilValue(databaseState);
  const [currentEventList, setCurrentEventList] = useRecoilState(
    currentEventListState
  );
  const playerProgress = useRecoilValue(playerProgressState);
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [videoPath, setVideoPath] = useState<string | undefined>();

  useEffect(() => {
    if (database) {
      database
        .getAll(DB_STORES.EVENT)
        .then((events) => setCurrentEventList(events));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [database]);

  const handleUploadVideo = (event: any) => {
    setVideoPath(URL.createObjectURL(event.target.files[0]));
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

  return (
    <div className={styles.container}>
      <div className={styles.controlBar}>
        <span>Control bar</span>
      </div>
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <ReflexContainer orientation="vertical">
            <ReflexElement>
              <div className={styles.pane}>
                <Player path={videoPath} />
              </div>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement>
              <ReflexContainer orientation="horizontal">
                <ReflexElement>
                  <div className={styles.pane}>
                    <p>video:</p>
                    <input type="file" onChange={handleUploadVideo} />
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

export default Something;
