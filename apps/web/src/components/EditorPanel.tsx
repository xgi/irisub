import { useRecoilValue } from 'recoil';
import { currentCueListState, currentEditorPanelTabState } from '../store/states';
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
    <div className="h-full flex flex-row flex-1 overflow-hidden">
      <EditorPanelSidebar />
      <div className="w-full overflow-auto">
        {currentCueList === null ? <LoadingContainer /> : renderContent()}
      </div>
    </div>
  );
};

export default EditorPanel;
