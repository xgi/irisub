import Modal from "../Modal";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  OAuthProvider,
} from "firebase/auth";
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

  const handleGithubLink = () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    linkWithPopup(currentUser, new GithubAuthProvider())
      .then(() => props.handleClose())
      .catch((error) => {
        console.warn("failed to link");
        console.error(error);
      });
  };

  const handleMicrosoftLink = () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    const provider = new OAuthProvider("microsoft.com");

    linkWithPopup(currentUser, provider)
      .then(() => props.handleClose())
      .catch((error) => {
        console.warn("failed to link");
        console.error(error);
      });
  };

  return !props.isOpen ? null : (
    <Modal isOpen={props.isOpen} handleClose={props.handleClose}>
      <div style={{ textAlign: "center" }}>
        <p>{userId}</p>
        <p>this is modal content</p>
        <p>this is modal content</p>
        <button onClick={() => handleGoogleLink()}>Login with Google</button>
        <button onClick={() => handleMicrosoftLink()}>Login with Microsoft</button>
        <button onClick={() => handleGithubLink()}>Login with GitHub</button>
      </div>
    </Modal>
  );
};

export default LoginModal;
