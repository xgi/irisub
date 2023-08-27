import { useEffect, useState } from 'react';
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
import { accentState } from '../store/theme';

type Props = unknown;

const Teams: React.FC<Props> = () => {
  const accent = useRecoilValue(accentState);
  const userId = useRecoilValue(userIdState);
  const setLoginModalOpen = useSetRecoilState(loginModalOpenState);
  const setInviteModalOpen = useSetRecoilState(inviteModalOpenState);
  const [isAnon, setIsAnon] = useState(true);
  const [teams, setTeams] = useState<Gateway.GetTeamsResponseBody['teams']>([]);
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);

    gateway.getTeams().then((data) => {
      setTeams(data.teams);
      setLoading(false);
    });
  };

  useEffect(() => reload(), []);

  useEffect(() => {
    const user = getAuth().currentUser;
    setIsAnon(!user || user.isAnonymous);
    reload();
  }, [userId]);

  const renderMembers = (
    teamId: string,
    members: { id: string; email: string; role: 'owner' | 'editor' }[]
  ) => {
    return (
      <table className="table-fixed w-full text-left border border-slate-6">
        <thead>
          <tr className="[&>th]:px-4 h-7 text-slate-11">
            <th style={{ width: '100%' }}>Email</th>
            <th style={{ width: '300px' }}>Role</th>
            <th style={{ width: '80px' }} />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr
              key={member.id}
              className="hover:cursor-pointer hover:bg-slate-4 [&>td]:px-4 h-10 border-t border-slate-6"
            >
              <td>
                {member.email}{' '}
                {member.id === userId ? <span className="text-slate-11 text-sm">(you)</span> : ''}
              </td>
              <td style={{ textTransform: 'capitalize' }}>{member.role}</td>
              <td style={{ textAlign: 'right' }}>
                <button
                  data-tooltip-id={`tt-user-actions-${teamId}-${member.id}`}
                  data-tooltip-content={'User Actions'}
                >
                  <span>
                    <IconBars3 width={24} height={24} />
                  </span>
                </button>

                <Tooltip
                  id={`tt-user-actions-${teamId}-${member.id}`}
                  className="tooltip"
                  place="left"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-scroll text-slate-12 bg-slate-1">
      {loading ? (
        <LoadingContainer />
      ) : isAnon ? (
        <div className="h-full flex items-center font-semibold">
          <span>
            Please{' '}
            <a
              className={`cursor-pointer text-${accent}-500 hover:text-${accent}-600`}
              onClick={() => setLoginModalOpen(true)}
            >
              sign in
            </a>{' '}
            to join or create a team.
          </span>
        </div>
      ) : (
        <section className="w-full max-w-screen-2xl m-4 grid grid-cols-3">
          <div className="col-span-1 select-none">
            <h3 className="text-2xl mb-0 font-semibold">Your Teams</h3>
          </div>
          <div className="col-span-2 mt-3">
            {teams.length > 0 ? (
              teams.map((team) => (
                <div key={team.id} className="mb-2">
                  <p className="font-bold mb-2">{team.name}</p>
                  {renderMembers(team.id, team.members)}
                </div>
              ))
            ) : (
              <>
                <p className="font-semibold">You haven't joined any teams.</p>
                <Button accent className="mt-4" onClick={() => setInviteModalOpen(true)}>
                  Create Team
                </Button>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Teams;
