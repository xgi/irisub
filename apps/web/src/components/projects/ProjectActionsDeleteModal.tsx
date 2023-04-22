import styles from '../../styles/components/ProjectActionsDeleteModal.module.scss';
import { Irisub } from '@irisub/shared';

import Button from '../Button';
import { IconX } from '../Icons';
import Modal from '../Modal';

type Props = {
  open: boolean;
  project: Irisub.Project;
  close: () => void;
};

const ProjectActionsDeleteModal: React.FC<Props> = (props: Props) => {
  return (
    <Modal isOpen={props.open} handleClose={props.close}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Delete Project</h3>
          <button className={styles.exit}>
            <IconX width={22} height={22} onClick={props.close} />
          </button>
        </div>

        <div className={styles.selector}></div>

        <div className={styles.inner}>
          <p>
            Are you sure you want to delete{' '}
            <span className={styles.projectName}>{props.project.title}</span>?
          </p>
          <p>This action is irreversable.</p>
        </div>

        <div className={styles.actions}>
          <Button onClick={props.close}>Cancel</Button>
          <Button className={styles.delete} accent onClick={() => console.log()}>
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectActionsDeleteModal;
