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
          {/* 
            Opting to render all pages with display:none for inactive ones in order to reduce
            render times when switching pages (especially when going to the editor) and dealing
            with triggers when component are first rendered -- e.g. when the <video> component
            is generated.
          */}
          <Editor hidden={currentNavPage !== NavPage.Editor} />
          <div style={currentNavPage !== NavPage.Projects ? { display: "none" } : {}}>
            projects page
          </div>
          <div style={currentNavPage !== NavPage.Settings ? { display: "none" } : {}}>
            settings page
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Base;
