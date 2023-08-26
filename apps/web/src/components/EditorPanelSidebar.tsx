/* eslint-disable jsx-a11y/anchor-is-valid */
import { Tooltip } from 'react-tooltip';
import { useRecoilState } from 'recoil';
import { currentEditorPanelTabState } from '../store/states';
import { EditorPanelTab } from '../util/constants';
import { classNames } from '../util/layout';

type Props = unknown;

const EditorPanelSidebar: React.FC<Props> = (props: Props) => {
  const [currentEditorPanelTab, setCurrentEditorPanelTab] = useRecoilState(
    currentEditorPanelTabState
  );

  return (
    <div className="w-auto h-full text-slate-12 bg-slate-1 border-r border-slate-6">
      <aside className="flex flex-col justify-between h-100 select-none">
        <nav className="flex flex-1 flex-nowrap flex-col text-slate-11">
          <a
            className={classNames(
              'relative p-2 flex flex-col flex-1 items-center justify-center cursor-pointer',
              currentEditorPanelTab === EditorPanelTab.Text
                ? 'text-emerald-500'
                : 'hover:text-slate-12'
            )}
            onClick={() => setCurrentEditorPanelTab(EditorPanelTab.Text)}
            data-tooltip-id="tt-editor-panel-text"
            data-tooltip-content="Edit Text"
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
          <Tooltip id="tt-editor-panel-text" className="tooltip" place="right" />
          <a
            className={classNames(
              'relative p-2 flex flex-col flex-1 items-center justify-center cursor-pointer',
              currentEditorPanelTab === EditorPanelTab.Styles
                ? 'text-emerald-500'
                : 'hover:text-slate-12'
            )}
            onClick={() => setCurrentEditorPanelTab(EditorPanelTab.Styles)}
            data-tooltip-id="tt-editor-panel-styles"
            data-tooltip-content="Styles"
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
          <Tooltip id="tt-editor-panel-styles" className="tooltip" place="right" />
        </nav>
      </aside>
    </div>
  );
};

export default EditorPanelSidebar;
