import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentEditorPanelTabState,
  currentProjectIdState,
  currentTrackState,
  editorShowMsState,
} from "../store/states";
import styles from "../styles/components/EditorPanel.module.scss";
import { EditorPanelTab } from "../util/constants";
import EditorPanelSidebar from "./EditorPanelSidebar";
import TextEditor from "./TextEditor";
import { Irisub } from "irisub-common";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";
import { currentProjectState } from "../store/project";
import { accentState, nextAccent, nextTheme, themeState } from "../store/theme";

type Props = {};

const EditorPanel: React.FC<Props> = (props: Props) => {
  const [currentEditorPanelTab, setCurrentEditorPanelTab] = useRecoilState(
    currentEditorPanelTabState
  );
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [showMs, setShowMs] = useRecoilState(editorShowMsState);
  const [theme, setTheme] = useRecoilState(themeState);
  const [accent, setAccent] = useRecoilState(accentState);

  return (
    <div className={styles.container}>
      <EditorPanelSidebar />
      <div className={styles.content}>
        {currentEditorPanelTab === EditorPanelTab.Debug ? (
          <>
            <button
              onClick={() => {
                const myNewProject: Irisub.Project = {
                  title: "my new project",
                };
                setCurrentProject(myNewProject);
              }}
            >
              create project
            </button>
            <button
              onClick={() => {
                setCurrentProjectId(uuidv4());
              }}
            >
              randomize currentProjectId {currentProjectId}
            </button>
            <button
              onClick={() => {
                if (currentProjectId === null) {
                  console.log("no current project");
                  return;
                }

                const track: Irisub.Track = {
                  id: uuidv4(),
                  project_id: currentProjectId,
                };
                setCurrentTrack(track);
              }}
            >
              create track
            </button>
            {/* <button
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
            </button> */}
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
            // onClick={async () => {
            //   const database = await initDb();
            //   database.clear("event");
            // }}
            >
              remove all events
            </button>
            <button onClick={() => setShowMs(!showMs)}>toggle showing ms</button>
            <button
              onClick={() => {
                getAuth().signOut();
              }}
            >
              logout
            </button>
            <button
              onClick={() => {
                setTheme(nextTheme(theme));
              }}
            >
              change theme (cur: {theme})
            </button>
            <button
              onClick={() => {
                setAccent(nextAccent(accent));
              }}
            >
              change accent (cur: {accent})
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
