import * as Popover from '@radix-ui/react-popover';
import styles from '../styles/components/UserProfileButton.module.scss';
import { IconLogout, IconSettings } from './Icons';
import { getAuth } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { userIdState } from '../store/states';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';

type Props = unknown;

const UserProfileButton: React.FC<Props> = (props: Props) => {
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
        <button className={styles.popoverButton} aria-label="Update dimensions">
          <span>{userName[0]}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.popoverContent} sideOffset={5}>
          <div className={styles.userDetail}>
            <span className={styles.name}>{userName}</span>
            <span className={styles.email}>{userEmail}</span>
          </div>
          <Link href="/settings">
            <button>
              <div>
                <IconSettings width={18} height={18} />
                <span>Settings</span>
              </div>
            </button>
          </Link>

          <button
            onClick={() => {
              setUserId(null);
              getAuth().signOut();
            }}
          >
            <div>
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
