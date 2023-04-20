import { useEffect, useState } from 'react';
import styles from '../styles/components/Teams.module.scss';
import { Gateway } from '@irisub/shared';
import LoadingContainer from './LoadingContainer';
import { gateway } from '../services/gateway';
import { useRecoilValue } from 'recoil';
import { currentNavPageState, userIdState } from '../store/states';
import { IconBars3 } from './Icons';
import { Tooltip } from 'react-tooltip';
import { NavPage } from '../util/constants';

type Props = unknown;

const Teams: React.FC<Props> = () => {
  const userId = useRecoilValue(userIdState);
  const currentNavPage = useRecoilValue(currentNavPageState);
  const [teams, setTeams] = useState<Gateway.GetTeamsResponseBody['teams']>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentNavPage === NavPage.Teams) {
      setLoading(true);

      gateway.getTeams().then((data) => {
        setTeams(data.teams);
        setLoading(false);
      });
    }
  }, [currentNavPage]);

  const renderMembers = (
    teamId: string,
    members: { id: string; email: string; role: 'owner' | 'editor' }[]
  ) => {
    return (
      <table style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '100%' }}>Email</th>
            <th style={{ width: '300px' }}>Role</th>
            <th style={{ width: '80px' }} />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                {member.email} {member.id === userId ? '(you)' : ''}{' '}
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
    <div className={styles.container}>
      {loading ? (
        <LoadingContainer />
      ) : (
        <>
          {' '}
          <section>
            <div className={styles.left}>
              <h3>Your Teams</h3>
            </div>
            <div className={styles.right}>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div key={team.id} className={styles.team}>
                    <p>{team.name}</p>
                    {renderMembers(team.id, team.members)}
                  </div>
                ))
              ) : (
                <p>You haven't joined any teams.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Teams;
