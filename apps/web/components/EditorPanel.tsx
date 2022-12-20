import { useRecoilState } from "recoil";
import { currentEditorPanelTabState, currentProjectState } from "../store/states";
import styles from "../styles/components/EditorPanel.module.scss";
import { EditorPanelTab } from "../util/constants";
import EditorPanelSidebar from "./EditorPanelSidebar";
import TextEditor from "./TextEditor";
import { Irisub } from "irisub-common";

type Props = {};

const EditorPanel: React.FC<Props> = (props: Props) => {
  const [currentEditorPanelTab, setCurrentEditorPanelTab] = useRecoilState(
    currentEditorPanelTabState
  );
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);

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
            // onClick={async () => {
            //   const database = await initDb();
            //   Array.from(Array(10).keys()).forEach(async (idx) => {
            //     const result = await database.put(DB_STORES.EVENT, {
            //       id: uuidv4(),
            //       index: idx,
            //       text: "",
            //       start_ms: idx * 2000,
            //       end_ms: idx * 2 * 1000 + 2000,
            //     });
            //     console.log(result);
            //   });
            // }}
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
function uuidv4(): string {
  throw new Error("Function not implemented.");
}
