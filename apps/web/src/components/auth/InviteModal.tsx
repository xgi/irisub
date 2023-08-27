import * as Tabs from '@radix-ui/react-tabs';
import Modal from '../Modal';
import { IconX } from '../Icons';
import InviteModalCreateTeam from './InviteModalCreateTeam';
import { useRecoilState, useRecoilValue } from 'recoil';
import { inviteModalOpenState } from '../../store/modals';
import InviteModalExistingTeam from './InviteModalExistingTeam';
import { accentState } from '../../store/theme';

type Props = unknown;

const InviteModal: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);
  const [inviteModalOpen, setInviteModalOpen] = useRecoilState(inviteModalOpenState);

  const close = () => setInviteModalOpen(false);

  return (
    <Modal isOpen={inviteModalOpen} handleClose={close}>
      <div className="w-full text-center">
        <div className="bg-slate-2 border-b border-slate-6 px-5 py-3 flex items-center justify-between">
          <h3 className="text-slate-12 text-lg m-0 font-bold">Invite Members</h3>
          <button className="text-slate-11 hover:text-slate-12 bg-transparent h-6 w-6 border-none cursor-pointer">
            <IconX width={22} height={22} />
          </button>
        </div>

        <Tabs.Root className="flex flex-col w-full" defaultValue="tabCreateTeam">
          <Tabs.List className="shrink-0 flex border-b border-slate-6">
            <Tabs.Trigger
              className={`bg-slate-1 px-5 h-9 flex-1 flex items-center justify-center leading-none text-slate-11 font-semibold select-none hover:text-slate-12 hover:bg-slate-4 data-[state=active]:text-slate-12 data-[state=active]:bg-${accent}-600 data-[state=active]:focus:relative outline-none cursor-pointer`}
              value="tabCreateTeam"
            >
              Create Team
            </Tabs.Trigger>
            <Tabs.Trigger
              className={`bg-slate-1 px-5 h-9 flex-1 flex items-center justify-center leading-none text-slate-11 font-semibold select-none hover:text-slate-12 hover:bg-slate-4 data-[state=active]:text-slate-12 data-[state=active]:bg-${accent}-600 data-[state=active]:focus:relative outline-none cursor-pointer`}
              value="tabExistingTeam"
            >
              Existing Team
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tabCreateTeam">
            <InviteModalCreateTeam close={close} />
          </Tabs.Content>
          <Tabs.Content value="tabExistingTeam">
            <InviteModalExistingTeam close={close} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </Modal>
  );
};

export default InviteModal;
