import { Irisub } from '@irisub/shared';

import Button from '../Button';
import { IconX } from '../Icons';
import Modal from '../Modal';
import { useRecoilValue } from 'recoil';
import { accentState } from '../../store/theme';

type Props = {
  open: boolean;
  project: Irisub.Project;
  close: () => void;
};

const ProjectActionsDeleteModal: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);

  return (
    <Modal isOpen={props.open} handleClose={props.close}>
      <div className="w-full text-center">
        <div className="bg-slate-2 border-b border-slate-6 px-5 py-3 flex items-center justify-between">
          <h3 className="text-slate-12 text-lg m-0 font-bold">Delete Project</h3>
          <button className="text-slate-11 hover:text-slate-12 bg-transparent h-6 w-6 border-none cursor-pointer">
            <IconX width={22} height={22} onClick={props.close} />
          </button>
        </div>

        <div className="w-full p-4 text-slate-12 text-base">
          <p>
            Are you sure you want to delete{' '}
            <span className={`text-${accent}-500 font-semibold`}>{props.project.title}</span>?
          </p>
          <p>This action is irreversable.</p>
        </div>

        <div className="w-full flex justify-end px-4 pb-2 gap-2">
          <Button onClick={props.close}>Cancel</Button>
          <Button accent onClick={() => console.log()}>
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectActionsDeleteModal;
