import * as Tabs from '@radix-ui/react-tabs';
import Modal from '../Modal';
import styles from '../../styles/components/InviteModal.module.scss';
import { IconX } from '../Icons';
import InviteModalCreateTeam from './InviteModalCreateTeam';
import { useRecoilState } from 'recoil';
import { inviteModalOpenState } from '../../store/modals';

type Props = unknown;

const InviteModal: React.FC<Props> = (props: Props) => {
  const [inviteModalOpen, setInviteModalOpen] = useRecoilState(inviteModalOpenState);

  const close = () => setInviteModalOpen(false);

  return (
    <Modal isOpen={inviteModalOpen} handleClose={close}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Invite Members</h3>
          <button className={styles.exit} onClick={close}>
            <IconX width={22} height={22} />
          </button>
        </div>

        <Tabs.Root className={styles.tabsRoot} defaultValue="tabCreateTeam">
          <Tabs.List className={styles.tabsList}>
            <Tabs.Trigger className={styles.tabsTrigger} value="tabCreateTeam">
              Create Team
            </Tabs.Trigger>
            <Tabs.Trigger className={styles.tabsTrigger} value="tabExistingTeam">
              Existing Team
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className={styles.tabsContent} value="tabCreateTeam">
            <InviteModalCreateTeam close={close} />
          </Tabs.Content>
          <Tabs.Content className={styles.tabsContent} value="tabExistingTeam">
            <p>Change your password here. After saving, you'll be logged out.</p>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </Modal>
  );
};

export default InviteModal;
