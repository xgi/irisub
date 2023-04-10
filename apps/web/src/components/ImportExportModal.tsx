import Modal from './Modal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styles from '../styles/components/ImportExportModal.module.scss';
import { importExportModalOpenState } from '../store/modals';
import { IconX } from './Icons';
import { useState } from 'react';

type Props = {
  onClose?: () => void;
};

const ImportExportModal: React.FC<Props> = (props: Props) => {
  const [importExportModalOpen, setImportExportModalOpen] = useRecoilState(
    importExportModalOpenState
  );
  const [mode, setMode] = useState<'import' | 'export'>('import');

  const close = () => {
    setImportExportModalOpen(false);
    if (props.onClose) props.onClose();
  };

  return !importExportModalOpen ? null : (
    <Modal isOpen={importExportModalOpen} handleClose={() => close()}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Import and Export Subtitles</h3>
          <button className={styles.exit}>
            <IconX width={22} height={22} onClick={() => close()} />
          </button>
        </div>

        <div className={styles.selector}>
          <button
            className={mode === 'import' ? styles.active : ''}
            onClick={() => setMode('import')}
          >
            Import
          </button>
          <button
            className={mode === 'export' ? styles.active : ''}
            onClick={() => setMode('export')}
          >
            Export
          </button>
        </div>

        <div className={styles.inner}>
          <p>some content goes here</p>
          <p>some content goes here</p>
          <p>some content goes here</p>
          <p>some content goes here</p>
        </div>

        <div className={styles.footer}>Some message here.</div>
      </div>
    </Modal>
  );
};

export default ImportExportModal;
