import { useEffect, useState } from 'react';
import * as Select from '@radix-ui/react-select';
import styles from '../../styles/components/InviteModalExistingTeam.module.scss';
import { IconCheck, IconChevronDown } from '../Icons';
import Button from '../Button';
import React from 'react';
import { gateway } from '../../services/gateway';
import { useRecoilState } from 'recoil';
import { currentProjectState } from '../../store/states';
import { Gateway } from '@irisub/shared';

type Props = {
  close: () => void;
};

const InviteModalExistingTeam: React.FC<Props> = (props: Props) => {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [teams, setTeams] = useState<Gateway.GetTeamsResponseBody['teams']>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    gateway.getTeams().then((data) => {
      setTeams(data.teams);
      setLoading(false);
    });
  }, []);

  const inviteTeam = () => {
    if (!currentProject || !selectedTeamId) return;

    setCurrentProject({ ...currentProject, team_id: selectedTeamId });
    props.close();
  };

  return teams.length > 0 ? (
    <>
      <div className={styles.container}>
        <div className={styles.teams}>
          <Select.Root
            value={selectedTeamId || undefined}
            onValueChange={(value) => setSelectedTeamId(value)}
          >
            <Select.Trigger className={styles.selectTrigger}>
              <Select.Value>
                {teams.find((team) => team.id === selectedTeamId)?.name || 'Select team'}
              </Select.Value>
              <Select.Icon className={styles.selectIcon}>
                <IconChevronDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal className={styles.selectPortal}>
              <Select.Content className={styles.selectContent}>
                <Select.Viewport className={styles.selectViewport}>
                  <Select.Group>
                    {teams.map((team) => (
                      <Select.Item key={team.id} value={team.id} className={styles.selectItem}>
                        <Select.ItemText>{team.name}</Select.ItemText>
                        <Select.ItemIndicator className={styles.selectItemIndicator}>
                          <IconCheck />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className={styles.info}>
          <span>
            The project <span className={styles.projectTitle}>{currentProject?.title}</span> will be
            accessible by team members according to their roles.
          </span>
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={props.close}>Cancel</Button>
        <Button accent disabled={loading} onClick={inviteTeam}>
          Invite Team
        </Button>
      </div>
    </>
  ) : (
    <div className={styles.noTeams}>You haven't joined any teams.</div>
  );
};

export default InviteModalExistingTeam;
