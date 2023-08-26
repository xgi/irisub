import { useEffect, useState } from 'react';
import { Gateway } from '@irisub/shared';
import LoadingContainer from './LoadingContainer';
import { gateway } from '../services/gateway';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userIdState } from '../store/states';
import { getAuth } from 'firebase/auth';
import { loginModalOpenState } from '../store/modals';
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
          <div className="text-center max-w-lg leading-6">
            <h1 className="font-bold text-lg">Invitation Unauthorized</h1>
            <p>This invitation was sent to a different email address.</p>
            <p>
              Please sign in with the address you received the invitation from, or ask the team
              owner to send an invitation to {/* TODO: accent color */}
              <span className="font-bold text-emerald-700">{getAuth().currentUser?.email}</span>
            </p>
          </div>
        );
      case 404:
        return (
          <div className="text-center max-w-lg leading-6">
            <h1 className="font-bold text-lg">Invitation Not Found</h1>
            <p>
              This is not a valid invitation link. Please ask the team owner to send a new
              invitation.
            </p>
          </div>
        );
      case 410:
        return (
          <div className="text-center max-w-lg leading-6">
            <h1 className="font-bold text-lg">Invitation Expired</h1>
            <p>This invitation has expired. Please ask the team owner to send a new invitation.</p>
          </div>
        );
      case 200:
        return (
          <div className="text-center max-w-lg leading-6">
            <h1 className="font-bold text-lg">Join Team</h1>
            <p>
              {/* TODO: accent color */}
              You are joining{' '}
              <span className="font-bold text-emerald-700">{invitation?.teamName}</span> with the{' '}
              <span className="font-bold text-emerald-700">
                {invitation?.invitation.invitee_role}
              </span>{' '}
              role.
            </p>
            <div className="flex justify-center gap-2">
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
    <div className="w-full h-full flex flex-col items-center overflow-y-scroll text-slate-12 bg-slate-1">
      {loading ? (
        <LoadingContainer />
      ) : (
        <div className="h-full flex items-center">
          {isAnon ? (
            <span className="font-bold">
              {/* TODO: accent color for link */}
              Please{' '}
              <a
                className="cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => setLoginModalOpen(true)}
              >
                sign in
              </a>{' '}
              to accept this invitation.
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
