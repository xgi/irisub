import Portal from "./Portal";
import styles from "../styles/components/Modal.module.scss";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
};

const Modal: React.FC<Props> = (props: Props) => {
  if (!props.isOpen) return null;

  return (
    <Portal>
      <div className={styles.wrapper} onClick={() => props.handleClose()}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {props.children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
