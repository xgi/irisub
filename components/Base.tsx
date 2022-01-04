import styles from "../styles/components/Base.module.scss";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import Editor from "./Editor";

type Props = {};

const Base: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Header />
        <div className={styles.middle}>
          <Sidebar />
          <Editor />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Base;
