import { useState } from 'react';
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
          <DropdownMenu.Content
            className="w-40 bg-slate-1 border border-slate-6 text-slate-12 rounded-md p-[5px]"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="group text-sm leading-none rounded-md cursor-pointer flex items-center h-6 relative px-3 select-none outline-none text-slate-11 bg-slate-1 data-[highlighted]:outline-none data-[highlighted]:text-slate-12 data-[highlighted]:bg-slate-4"
              onClick={handleDelete}
            >
              Delete Project
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default ProjectActionsDropdown;
