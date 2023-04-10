import styles from '../styles/components/Base.module.scss';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './sidebar/Sidebar';
import Editor from './Editor';
import { useRecoilValue } from 'recoil';
import { currentNavPageState } from '../store/states';
import { NavPage } from '../util/constants';
import TracksModal from './TracksModal';
import Settings from './settings/Settings';
import ImportExportModal from './ImportExportModal';
import Projects from './projects/Projects';

type Props = unknown;

const Base: React.FC<Props> = (props: Props) => {
  const currentNavPage = useRecoilValue(currentNavPageState);

  return (
    <div className={styles.container}>
      <TracksModal />
      <ImportExportModal />

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
          <Projects hidden={currentNavPage !== NavPage.Projects} />
          <Settings hidden={currentNavPage !== NavPage.Settings} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Base;
