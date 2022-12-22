import { getAuth, GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { useRecoilValue } from "recoil";
import { userIdState } from "../../store/states";
import styles from "../styles/components/Header.module.scss";

type Props = {};

const HeaderLoginButton: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);

  const handleGoogleLink = () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    linkWithPopup(currentUser, new GoogleAuthProvider()).catch((error) => {
      console.warn("failed to link");
      console.error(error);
    });
  };

  return (
    <span>
      <span>{userId}</span>
      <button onClick={() => handleGoogleLink()}>Login with Google</button>
    </span>
  );
};

export default HeaderLoginButton;
