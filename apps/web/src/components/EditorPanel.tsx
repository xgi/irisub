import { useRecoilState } from "recoil";
import {
  currentEditorPanelTabState,
  currentProjectState,
  currentTrackState,
} from "../store/states";
import styles from "../styles/components/EditorPanel.module.scss";
import { EditorPanelTab } from "../util/constants";
import EditorPanelSidebar from "./EditorPanelSidebar";
import TextEditor from "./TextEditor";
import { Irisub } from "irisub-common";
import { v4 as uuidv4 } from "uuid";

type Props = {};

const EditorPanel: React.FC<Props> = (props: Props) => {
  const [currentEditorPanelTab, setCurrentEditorPanelTab] = useRecoilState(
    currentEditorPanelTabState
  );
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);

  return (
    <div className={styles.container}>
      <EditorPanelSidebar />
      <div className={styles.content}>
        {currentEditorPanelTab === EditorPanelTab.Debug ? (
          <>
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
                if (currentProject === null) {
                  console.log("no current project");
                  return;
                }

                const track: Irisub.Track = {
                  id: uuidv4(),
                  project_id: currentProject.id,
                  events: [],
                };
                setCurrentTrack(track);
              }}
            >
              create track
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
            // onClick={async () => {
            //   const database = await initDb();
            //   database.getAll(DB_STORES.PROJECT).then((projects) => {
            //     console.log(`Found ${projects.length} projects in persistant store:`);
            //     projects.forEach((project) => console.log(project));
            //   });
            // }}
            >
              list all projects
            </button>
            <button
            // onClick={async () => {
            //   const database = await initDb();
            //   database.getAll(DB_STORES.EVENT).then((events) => {
            //     console.log(`Found ${events.length} events in persistant store:`);
            //     events.forEach((event) => console.log(event));
            //   });
            // }}
            >
              list all events
            </button>
            <button
              onClick={async () => {
                if (currentTrack) {
                  const events = Array.from(Array(10).keys()).map((idx) => {
                    return {
                      id: uuidv4(),
                      index: idx,
                      text: "",
                      start_ms: idx * 2000,
                      end_ms: idx * 2 * 1000 + 2000,
                    };
                  });
                  setCurrentTrack({ ...currentTrack, events: events });
                }
              }}
            >
              add some events
            </button>
            <button
            // onClick={async () => {
            //   const database = await initDb();
            //   database.clear("event");
            // }}
            >
              remove all events
            </button>
          </>
        ) : (
          ""
        )}

        {currentEditorPanelTab === EditorPanelTab.Text ? (
          <TextEditor />
        ) : (
          <p>styles tab content here</p>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
