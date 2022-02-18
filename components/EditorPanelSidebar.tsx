import { useRecoilState } from "recoil";
import { currentEditorPanelTabState } from "../store/states";
import styles from "../styles/components/EditorPanelSidebar.module.scss";
import { EditorPanelTab } from "../util/constants";
import { classNames } from "../util/layout";

type Props = {};

const EditorPanelSidebar: React.FC<Props> = (props: Props) => {
  const [currentEditorPanelTab, setCurrentEditorPanelTab] = useRecoilState(
    currentEditorPanelTabState
  );

  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <nav>
          <a
            className={classNames(
              currentEditorPanelTab === EditorPanelTab.Text ? styles.active : ""
            )}
            onClick={() => setCurrentEditorPanelTab(EditorPanelTab.Text)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </a>
          <a
            className={classNames(
              currentEditorPanelTab === EditorPanelTab.Styles
                ? styles.active
                : ""
            )}
            onClick={() => setCurrentEditorPanelTab(EditorPanelTab.Styles)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </a>
        </nav>
      </aside>
    </div>
  );
};

export default EditorPanelSidebar;
