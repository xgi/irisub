import Modal from "../Modal";
import { getAuth, GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { useRecoilValue } from "recoil";
import { userIdState } from "../../store/states";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

const LoginModal: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);

  const handleGoogleLink = () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    linkWithPopup(currentUser, new GoogleAuthProvider())
      .then(() => props.handleClose())
      .catch((error) => {
        console.warn("failed to link");
        console.error(error);
      });
  };

  return !props.isOpen ? null : (
    <Modal isOpen={props.isOpen} handleClose={props.handleClose}>
      {/* <button onClick={() => console.log("clicked")}>something</button> */}
      <div style={{ textAlign: "center" }}>
        <p>{userId}</p>
        <p>this is modal content</p>
        <p>this is modal content</p>
        <button onClick={() => handleGoogleLink()}>Login with Google</button>
      </div>
    </Modal>
  );
};

export default LoginModal;
