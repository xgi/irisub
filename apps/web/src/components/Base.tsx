import styles from "../styles/components/Base.module.scss";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import Editor from "./Editor";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentNavPageState, userIdState } from "../store/states";
import { NavPage } from "../util/constants";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

type Props = {};

const Base: React.FC<Props> = (props: Props) => {
  const currentNavPage = useRecoilValue(currentNavPageState);
  const [userId, setUserId] = useRecoilState(userIdState);

  onAuthStateChanged(getAuth(), (user) => {
    setUserId(user ? user.uid : null);
    if (user) {
      setUserId(user.uid);
    } else {
      console.log("wasn't logged in -- signing in anonymously");
      signInAnonymously(getAuth());
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Header />
        <div className={styles.middle}>
          <Sidebar />
          {/* 
            Opting to render all pages with display:none for inactive ones in order to reduce
            render times when switching pages (especially when going to the editor) and dealing
            with triggers when component are first rendered -- e.g. when the <video> component
            is generated.
          */}
          <Editor hidden={currentNavPage !== NavPage.Editor} />
          <p style={currentNavPage !== NavPage.Projects ? { display: "none" } : {}}>
            projects page
          </p>
          <p style={currentNavPage !== NavPage.Settings ? { display: "none" } : {}}>
            settings page user id: {userId}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Base;
