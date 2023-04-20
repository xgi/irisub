import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import styles from '../../styles/components/InviteModalCreateTeam.module.scss';
import { IconCheck, IconChevronDown, IconPlus, IconTrash } from '../Icons';
import Button from '../Button';
import { randomProjectName } from '../../util/random';
import React from 'react';
import { gateway } from '../../services/gateway';
import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import { currentProjectState } from '../../store/states';
import { Irisub } from '@irisub/shared';

const TEAM_NAME_PLACEHOLDER = randomProjectName();

type Member = {
  email: string;
  role: 'owner' | 'editor';
};

type Props = {
  close: () => void;
};

const InviteModalCreateTeam: React.FC<Props> = (props: Props) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [members, setMembers] = useState<Member[]>([{ email: '', role: 'editor' }]);
  const currentProject = useRecoilValue(currentProjectState);
  const [loading, setLoading] = useState(false);

  const createTeam = () => {
    setLoading(true);

    const newTeam: Irisub.Team = { id: nanoid(), name: newTeamName };

    gateway
      .upsertTeam(newTeam)
      .then(() => {
        if (currentProject) gateway.upsertProject(currentProject, newTeam.id);
      })
      .finally(() => {
        setLoading(false);
        props.close();
      });
  };

  const updateMember = (index: number, newMember: Member) => {
    const temp = [...members];
    temp[index] = newMember;
    setMembers(temp);
  };

  const deleteMember = (index: number) => {
    const temp = [...members];
    temp.splice(index, 1);
    setMembers(temp);
  };

  const renderMemberRows = () => {
    if (members.length === 0) return <p>Not inviting any members.</p>;

    return members.map((member, index) => (
      <div key={index} className={styles.member}>
        <input
          placeholder={'example@example.com'}
          value={member.email}
          onChange={(e) => updateMember(index, { email: e.target.value, role: member.role })}
        />

        <Select.Root
          value={member.role}
          onValueChange={(value) =>
            updateMember(index, { email: member.email, role: value as 'editor' | 'owner' })
          }
        >
          <Select.Trigger className={styles.selectTrigger} aria-label="Food">
            <Select.Value>{member.role}</Select.Value>
            <Select.Icon className={styles.selectIcon}>
              <IconChevronDown />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal className={styles.selectPortal}>
            <Select.Content className={styles.selectContent}>
              <Select.Viewport className={styles.selectViewport}>
                <Select.Group>
                  <Select.Item value="editor" className={styles.selectItem}>
                    <Select.ItemText>Editor</Select.ItemText>
                    <Select.ItemIndicator className={styles.selectItemIndicator}>
                      <IconCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item value="owner" className={styles.selectItem}>
                    <Select.ItemText>Owner</Select.ItemText>
                    <Select.ItemIndicator className={styles.selectItemIndicator}>
                      <IconCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <button className={styles.delete} onClick={() => deleteMember(index)}>
          <IconTrash width={18} height={18} />
        </button>
      </div>
    ));
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.teamName}>
          <label>Team name</label>
          <input
            placeholder={TEAM_NAME_PLACEHOLDER}
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.memberList}>
          <div className={styles.header}>
            <span>Invite members</span>
            <Button onClick={() => setMembers([...members, { email: '', role: 'editor' }])}>
              <IconPlus width={18} height={18} />
              <span>Add member</span>
            </Button>
          </div>
          {renderMemberRows()}
        </div>
      </div>
      <div className={styles.footer}>
        <Button>Cancel</Button>
        <Button accent disabled={loading} onClick={createTeam}>
          Create Team
        </Button>
      </div>
    </>
  );
};

export default InviteModalCreateTeam;
