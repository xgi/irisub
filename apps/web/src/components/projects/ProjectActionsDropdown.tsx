import { useState } from 'react';
import styles from '../../styles/components/ProjectActionsDropdown.module.scss';
import { Irisub } from '@irisub/shared';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { IconBars3 } from '../Icons';
import { Tooltip } from 'react-tooltip';
import ProjectActionsDeleteModal from './ProjectActionsDeleteModal';

type Props = {
  project: Irisub.Project;
};

const ProjectActionsDropdown: React.FC<Props> = (props: Props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  return (
    <>
      <ProjectActionsDeleteModal
        project={props.project}
        open={deleteModalOpen}
        close={() => setDeleteModalOpen(false)}
      />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div
            data-tooltip-id={`tt-project-actions-${props.project.id}`}
            data-tooltip-content={'Project Actions'}
          >
            <span>
              <IconBars3 width={24} height={24} />
            </span>
          </div>
        </DropdownMenu.Trigger>
        <Tooltip id={`tt-project-actions-${props.project.id}`} className="tooltip" place="left" />

        <DropdownMenu.Portal>
          <DropdownMenu.Content className={styles.DropdownMenuContent} sideOffset={5}>
            <DropdownMenu.Item className={styles.DropdownMenuItem} onClick={handleDelete}>
              Delete Project
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default ProjectActionsDropdown;
