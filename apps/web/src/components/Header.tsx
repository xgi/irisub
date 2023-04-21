import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentProjectState } from '../store/states';
import styles from '../styles/components/Header.module.scss';
import Button from './Button';
import { IconCloud, IconInvite, IconPencil } from './Icons';
import UserProfileButton from './UserProfileButton';
import { inviteModalOpenState, loginModalOpenState } from '../store/modals';

type Props = unknown;

const Header: React.FC<Props> = (props: Props) => {
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [editingProjectTitle, setEditingProjectTitle] = useState(false);
  const [tempProjectTitle, setTempProjectTitle] = useState('');
  const setLoginModalOpen = useSetRecoilState(loginModalOpenState);
  const setInviteModalOpen = useSetRecoilState(inviteModalOpenState);

  const updateProjectTitle = () => {
    setEditingProjectTitle(false);
    if (currentProject) {
      setCurrentProject({ ...currentProject, title: tempProjectTitle });
    }
  };

  useEffect(() => {
    if (editingProjectTitle && currentProject) setTempProjectTitle(currentProject.title || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <header className={styles.header}>
        <div className={styles.group}>
          <a href="/" className={styles.brand}>
            <span>IRISUB</span>
          </a>
          {renderProjectTitle()}
        </div>
        <div className={styles.group}>
          <Button
            onClick={() => {
              const user = getAuth().currentUser;
              if (!user || user.isAnonymous) {
                setLoginModalOpen(true);
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
          {!getAuth().currentUser || getAuth().currentUser?.isAnonymous ? (
            <Button accent={true} onClick={() => setLoginModalOpen(true)}>
              <span>
                <IconCloud />
                Save Workspace
              </span>
            </Button>
          ) : (
            <UserProfileButton />
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
