/* eslint-disable no-restricted-globals */
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

  const renderPage = () => {
    if (currentNavPage === NavPage.Editor) return <Editor />;
    if (currentNavPage === NavPage.Projects) return <Projects />;
    if (currentNavPage === NavPage.Settings) return <Settings />;
  };

  return (
    <div className={styles.container}>
      <TracksModal />
      <ImportExportModal />

      <div className={styles.column}>
        <Header />
        <div className={styles.middle}>
          <Sidebar />
          {renderPage()}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Base;
