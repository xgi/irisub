import { useEffect, useState } from 'react';
import styles from '../styles/components/Join.module.scss';
import { Gateway } from '@irisub/shared';
import LoadingContainer from './LoadingContainer';
import { gateway } from '../services/gateway';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userIdState } from '../store/states';
import { IconBars3 } from './Icons';
import { Tooltip } from 'react-tooltip';
import { getAuth } from 'firebase/auth';
import { inviteModalOpenState, loginModalOpenState } from '../store/modals';
import Button from './Button';
import { Link, useLocation } from 'wouter';

type Props = {
  invitationId: string;
};

const Join: React.FC<Props> = (props: Props) => {
  const [, navigate] = useLocation();
  const userId = useRecoilValue(userIdState);
  const setLoginModalOpen = useSetRecoilState(loginModalOpenState);
  const [isAnon, setIsAnon] = useState(true);
  const [invitation, setInvitation] = useState<Gateway.GetInvitationResponseBody | undefined>();
  const [getInvitationCode, setGetInvitationCode] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAnon && props.invitationId) {
      setLoading(true);
      setGetInvitationCode(-1);
      setInvitation(undefined);

      gateway
        .getInvitation(props.invitationId)
        .then((data) => {
          setInvitation(data);
          setGetInvitationCode(200);
        })
        .catch((err) => {
          setGetInvitationCode(err.code);
        })
        .finally(() => setLoading(false));
    }
  }, [isAnon, props.invitationId]);

  useEffect(() => {
    const user = getAuth().currentUser;
    setIsAnon(!user || user.isAnonymous);
  }, [userId]);

  const acceptInvitation = () => {
    if (invitation) {
      gateway.acceptInvitation(invitation.invitation.id).then(() => navigate('/teams'));
    }
  };

  const renderInvitation = () => {
    switch (getInvitationCode) {
      case 401:
        return (
          <div className={styles.info}>
            <h1>Invitation Unauthorized</h1>
            <p>This invitation was sent to a different email address.</p>
            <p>
              Please sign in with the address you received the invitation from, or ask the team
              owner to send an invitation to{' '}
              <span className={styles.highlight}>{getAuth().currentUser?.email}</span>
            </p>
          </div>
        );
      case 404:
        return (
          <div className={styles.info}>
            <h1>Invitation Not Found</h1>
            <p>
              This is not a valid invitation link. Please ask the team owner to send a new
              invitation.
            </p>
          </div>
        );
      case 410:
        return (
          <div className={styles.info}>
            <h1>Invitation Expired</h1>
            <p>This invitation has expired. Please ask the team owner to send a new invitation.</p>
          </div>
        );
      case 200:
        return (
          <div className={styles.info}>
            <h1>Join Team</h1>
            <p>
              You are joining <span className={styles.highlight}>{invitation?.teamName}</span> with
              the <span className={styles.highlight}>{invitation?.invitation.invitee_role}</span>{' '}
              role.
            </p>
            <div className={styles.buttons}>
              <Link href="/">
                <Button>Cancel</Button>
              </Link>
              <Button accent onClick={() => acceptInvitation()}>
                Join Team
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <LoadingContainer />
      ) : (
        <div className={styles.container}>
          {isAnon ? (
            <span className={styles.anonMessage}>
              Please <a onClick={() => setLoginModalOpen(true)}>sign in</a> to accept this
              invitation.
            </span>
          ) : (
            renderInvitation()
          )}
        </div>
      )}
    </div>
  );
};

export default Join;
