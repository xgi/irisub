import { useRecoilValue } from 'recoil';
import { currentCueListState, currentEditorPanelTabState } from '../store/states';
import styles from '../styles/components/EditorPanel.module.scss';
import { EditorPanelTab } from '../util/constants';
import EditorPanelSidebar from './EditorPanelSidebar';
import TextEditor from './TextEditor';
import LoadingContainer from './LoadingContainer';

type Props = unknown;

const EditorPanel: React.FC<Props> = (props: Props) => {
  const currentEditorPanelTab = useRecoilValue(currentEditorPanelTabState);
  const currentCueList = useRecoilValue(currentCueListState);

  const renderContent = () => {
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
