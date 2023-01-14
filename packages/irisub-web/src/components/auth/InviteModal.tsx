import Modal from "../Modal";
import { useRecoilValue } from "recoil";
import { userIdState } from "../../store/states";
import styles from "../../styles/components/InviteModal.module.scss";
import { IconX } from "../Icons";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

const InviteModal: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);

  return !props.isOpen ? null : (
    <Modal isOpen={props.isOpen} handleClose={props.handleClose}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Invite Members</h3>
          <button className={styles.exit} onClick={() => props.handleClose()}>
            <IconX width={22} height={22} />
          </button>
        </div>
        <p>{userId}</p>
        <p>this is the invitation modal</p>
        <div className={styles.footer}>
          <span>
            Your name and email address will be shared with the invitee.
            {/* Your basic information (name and email address) will be shared with the invitee */}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default InviteModal;
