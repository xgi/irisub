import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentProjectState } from '../store/states';
import Button from './Button';
import { IconCloud, IconGroup, IconInvite, IconPencil } from './Icons';
import UserProfileButton from './UserProfileButton';
import { inviteModalOpenState, loginModalOpenState } from '../store/modals';
import { Link } from 'wouter';

type Props = unknown;

const Header: React.FC<Props> = (props: Props) => {
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [editingProjectTitle, setEditingProjectTitle] = useState(false);
  const [tempProjectTitle, setTempProjectTitle] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useRecoilState(loginModalOpenState);
  const setInviteModalOpen = useSetRecoilState(inviteModalOpenState);

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
          className="text-lg"
        >
          <input
            className="w-80 py-0.5 px-1 inline bg-slate-3 text-slate-12 outline outline-slate-7 rounded-sm border-none"
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
        <span
          onClick={() => setEditingProjectTitle(true)}
          className="text-lg inline-flex justify-center items-center cursor-pointer gap-2 leading-5 text-slate-11 hover:text-slate-12"
        >
          <span className="font-bold max-w-xs whitespace-nowrap overflow-x-hidden overflow-ellipsis">
            {currentProject?.title || 'Untitled project'}
          </span>
          <IconPencil />
        </span>
      );
    }
  };

  return (
    <div className="h-auto w-full overflow-hidden bg-slate-1 border-b border-slate-6">
      <header className="flex flex-1 p-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="py-2 px-4 tracking-widest text-slate-12 font-bold justify-center items-center inline-flex"
          >
            <span className="leading-none">IRISUB</span>
          </a>
          {renderProjectTitle()}
        </div>
        <div className="flex items-center gap-2">
          {!currentProject?.team_id ? (
            <Button
              className="text-sm"
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
          ) : (
            <Link href="/teams">
              <Button>
                <span>
                  <IconGroup /> Teams
                </span>
              </Button>
            </Link>
          )}
          {!getAuth().currentUser || getAuth().currentUser?.isAnonymous ? (
            <Button className="text-sm" accent={true} onClick={() => setLoginModalOpen(true)}>
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
