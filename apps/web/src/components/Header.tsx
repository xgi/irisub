import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentProjectIdState, currentProjectState, userIdState } from '../store/states';
import styles from '../styles/components/Header.module.scss';
import InviteModal from './auth/InviteModal';
import LoginModal from './auth/LoginModal';
import Button from './Button';
import { IconCloud, IconInvite, IconPencil } from './Icons';

type Props = unknown;

const Header: React.FC<Props> = (props: Props) => {
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const currentProjectId = useRecoilValue(currentProjectIdState);
  const userId = useRecoilValue(userIdState);
  const [editingProjectTitle, setEditingProjectTitle] = useState(false);
  const [tempProjectTitle, setTempProjectTitle] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalCallback, setLoginModalCallback] = useState<() => void | undefined>();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const updateProjectTitle = () => {
    setEditingProjectTitle(false);
    if (currentProject) {
      setCurrentProject({ ...currentProject, title: tempProjectTitle });
    }
  };

  useEffect(() => {
    if (editingProjectTitle && currentProject) setTempProjectTitle(currentProject.title || '');
  }, [editingProjectTitle]);

  const renderProjectTitle = () => {
    if (!currentProject) return;

    if (editingProjectTitle) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProjectTitle();
          }}
          className={styles.project}
        >
          <input
            value={tempProjectTitle}
            placeholder="Untitled project"
            onChange={(e) => setTempProjectTitle(e.target.value)}
            onFocus={(e) => e.target.select()}
            onBlur={() => updateProjectTitle()}
            onSubmit={(e) => console.log('here')}
            autoFocus
          />
        </form>
      );
    } else {
      return (
        <span onClick={() => setEditingProjectTitle(true)} className={styles.project}>
          <span>{currentProject?.title || 'Untitled project'}</span>
          <IconPencil />
        </span>
      );
    }
  };

  return (
    <div className={styles.container}>
      <InviteModal isOpen={inviteModalOpen} handleClose={() => setInviteModalOpen(false)} />
      <LoginModal
        isOpen={loginModalOpen}
        handleClose={() => {
          setLoginModalOpen(false);
          setLoginModalCallback(undefined);
        }}
        callback={loginModalCallback}
      />
      <header className={styles.header}>
        <div className={styles.group}>
          <a href="/" className={styles.brand}>
            <span>IRISUB</span>
          </a>
          {renderProjectTitle()}
          {currentProjectId}
        </div>
        <div className={styles.group}>
          {userId}
          <Button
            onClick={() => {
              const user = getAuth().currentUser;
              if (!user || user.isAnonymous) {
                setLoginModalOpen(true);
                setLoginModalCallback(() => () => setInviteModalOpen(true));
              } else {
                setInviteModalOpen(true);
              }
            }}
          >
            <span>
              <IconInvite />
              Invite Members
            </span>
          </Button>
          <Button accent={true} onClick={() => setLoginModalOpen(true)}>
            <span>
              <IconCloud />
              Save Workspace
            </span>
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
