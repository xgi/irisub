/* eslint-disable no-restricted-globals */
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
import { useRecoilValue } from 'recoil';
import { accentState } from '../store/theme';

type Props = unknown;

const Base: React.FC<Props> = () => {
  const accent = useRecoilValue(accentState);

  return (
    <div
      className={`bg-slate-1 w-screen h-screen flex selection:bg-${accent}-600 selection:text-slate-12`}
    >
      <TracksModal />
      <ImportExportModal />
      <LoginModal />
      <InviteModal />

      <div className="flex flex-col w-full h-full">
        <Header />
        <div className="flex flex-row flex-1 overflow-auto">
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
