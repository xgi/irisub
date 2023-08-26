import Modal from '../Modal';
import { useRecoilState } from 'recoil';
import { importExportModalOpenState } from '../../store/modals';
import { IconX } from '../Icons';
import ExportMenu from './ExportMenu';
import * as Tabs from '@radix-ui/react-tabs';

type Props = {
  onClose?: () => void;
};

const ImportExportModal: React.FC<Props> = (props: Props) => {
  const [importExportModalOpen, setImportExportModalOpen] = useRecoilState(
    importExportModalOpenState
  );

  const close = () => {
    setImportExportModalOpen(false);
    if (props.onClose) props.onClose();
  };

  return !importExportModalOpen ? null : (
    <Modal isOpen={importExportModalOpen} handleClose={() => close()}>
      <div className="w-full text-center">
        <div className="bg-slate-2 border-b border-slate-6 p-5 flex items-center justify-between">
          <h3 className="text-slate-12 text-lg m-0 font-bold">Import and Export Subtitles</h3>
          <button className="text-slate-11 hover:text-slate-12 bg-transparent h-6 w-6 border-none cursor-pointer">
            <IconX width={22} height={22} onClick={() => close()} />
          </button>
        </div>

        <Tabs.Root className="flex flex-col w-full" defaultValue="import">
          <Tabs.List className="shrink-0 flex border-b border-slate-6">
            <Tabs.Trigger
              className="bg-slate-1 px-5 h-9 flex-1 flex items-center justify-center leading-none text-slate-11 select-none hover:text-slate-12 hover:bg-slate-4 data-[state=active]:text-slate-12 data-[state=active]:bg-slate-5 data-[state=active]:focus:relative outline-none cursor-pointer"
              value="import"
            >
              Import
            </Tabs.Trigger>
            <Tabs.Trigger
              className="bg-slate-1 px-5 h-9 flex-1 flex items-center justify-center leading-none text-slate-11 select-none hover:text-slate-12 hover:bg-slate-4 data-[state=active]:text-slate-12 data-[state=active]:bg-slate-5 data-[state=active]:focus:relative outline-none cursor-pointer"
              value="export"
            >
              Export
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="import">
            <p>import menu placeholder</p>
          </Tabs.Content>
          <Tabs.Content value="export">
            <ExportMenu />
          </Tabs.Content>
        </Tabs.Root>

        <div className="text-slate-11 bg-slate-2 px-4 py-2 font-medium text-xs border-t border-slate-6">
          Some message here.
        </div>
      </div>
    </Modal>
  );
};

export default ImportExportModal;
