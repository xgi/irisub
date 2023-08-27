import * as Popover from '@radix-ui/react-popover';
import { IconLogout, IconSettings } from './Icons';
import { getAuth } from 'firebase/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userIdState } from '../store/states';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { accentState } from '../store/theme';

type Props = unknown;

const UserProfileButton: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;

    user.providerData.forEach((providerData) => {
      if (providerData.email) setUserEmail(providerData.email);
      if (providerData.displayName) setUserName(providerData.displayName);
    });
  }, [userId]);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`rounded-full h-8 w-8 inline-flex items-center justify-center bg-${accent}-600 hover:bg-${accent}-500`}
        >
          <span className="text-slate-12 font-bold">{userName[0]}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="flex flex-col max-w-xs rounded-md mr-1 bg-slate-1 border border-slate-6 [&>*]:text-slate-11 [&>*]:px-3 [&>*]:py-2"
          sideOffset={5}
        >
          <div className="flex flex-col text-xs border-b border-slate-6">
            <span className="font-semibold text-slate-12">{userName}</span>
            <span>{userEmail}</span>
          </div>
          <Link href="/settings">
            <button className="w-full text-left hover:bg-slate-4 hover:text-slate-12">
              <div className="inline-flex justify-center items-center gap-3">
                <IconSettings width={18} height={18} />
                <span>Settings</span>
              </div>
            </button>
          </Link>

          <button
            className="w-full text-left hover:bg-slate-4 hover:text-slate-12"
            onClick={() => {
              setUserId(null);
              getAuth().signOut();
            }}
          >
            <div className="inline-flex justify-center items-center gap-3">
              <IconLogout width={18} height={18} />
              <span>Logout</span>
            </div>
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default UserProfileButton;
