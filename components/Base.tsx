import styles from "../styles/components/Base.module.scss";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import Editor from "./Editor";
import { useRecoilValue } from "recoil";
import { currentNavPageState } from "../store/states";
import { NavPage } from "../util/constants";

type Props = {};

const Base: React.FC<Props> = (props: Props) => {
  const currentNavPage = useRecoilValue(currentNavPageState);

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Header />
        <div className={styles.middle}>
          <Sidebar />
          {currentNavPage === NavPage.Editor ? (
            <Editor />
          ) : (
            <p>Not on the editor page</p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Base;
