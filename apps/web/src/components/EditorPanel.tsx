import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentCueListState,
  currentEditorPanelTabState,
  editorShowMsState,
  userIdState,
} from '../store/states';
import styles from '../styles/components/EditorPanel.module.scss';
import { EditorPanelTab } from '../util/constants';
import EditorPanelSidebar from './EditorPanelSidebar';
import TextEditor from './TextEditor';
import { getAuth } from 'firebase/auth';
import { accentState, nextAccent, nextTheme, themeState } from '../store/theme';
import LoadingContainer from './LoadingContainer';

type Props = unknown;

const EditorPanel: React.FC<Props> = (props: Props) => {
  const currentEditorPanelTab = useRecoilValue(currentEditorPanelTabState);
  const currentCueList = useRecoilValue(currentCueListState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [showMs, setShowMs] = useRecoilState(editorShowMsState);
  const [theme, setTheme] = useRecoilState(themeState);
  const [accent, setAccent] = useRecoilState(accentState);

  const renderContent = () => {
    if (currentEditorPanelTab === EditorPanelTab.Debug) {
      return (
        <>
          <button onClick={() => setShowMs(!showMs)}>toggle showing ms</button>
          <button
            onClick={() => {
              setUserId(null);
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
      );
    }

    if (currentEditorPanelTab === EditorPanelTab.Text) {
      return <TextEditor />;
    }

    if (currentEditorPanelTab === EditorPanelTab.Styles) {
      return <p>styles tab content here</p>;
    }
  };

  return (
    <div className={styles.container}>
      <EditorPanelSidebar />
      <div className={styles.content}>
        {currentCueList === null ? <LoadingContainer /> : renderContent()}
      </div>
    </div>
  );
};

export default EditorPanel;
