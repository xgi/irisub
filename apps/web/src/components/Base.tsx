/* eslint-disable no-restricted-globals */
import styles from '../styles/components/Base.module.scss';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './sidebar/Sidebar';
import Editor from './Editor';
import { Route, Switch } from 'wouter';
import TracksModal from './TracksModal';
import Settings from './settings/Settings';
import ImportExportModal from './convert/ImportExportModal';
import Projects from './projects/Projects';
import Teams from './Teams';
import NotFoundPage from './NotFoundPage';
import LoginModal from './auth/LoginModal';
import InviteModal from './auth/InviteModal';
import Join from './Join';

type Props = unknown;

const Base: React.FC<Props> = () => {
  return (
    <div className={styles.container}>
      <TracksModal />
      <ImportExportModal />
      <LoginModal />
      <InviteModal />

      <div className={styles.column}>
        <Header />
        <div className={styles.middle}>
          <Sidebar />

          <Switch>
            <Route path="/">
              <Editor />
            </Route>
            <Route path="/projects">
              <Projects />
            </Route>
            <Route path="/teams">
              <Teams />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/join/:invitationId">
              {(params) => <Join invitationId={params.invitationId || ''} />}
            </Route>

            <Route path="/:rest*">
              <NotFoundPage />
            </Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Base;
