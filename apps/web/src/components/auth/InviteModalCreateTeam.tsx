import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { IconCheck, IconChevronDown, IconPlus, IconTrash } from '../Icons';
import Button from '../Button';
import { randomProjectName } from '../../util/random';
import React from 'react';
import { gateway } from '../../services/gateway';
import { nanoid } from 'nanoid';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentProjectState } from '../../store/states';
import { Irisub } from '@irisub/shared';
import { accentState } from '../../store/theme';

const TEAM_NAME_PLACEHOLDER = randomProjectName();

type Member = {
  email: string;
  role: 'owner' | 'editor';
};

type Props = {
  close: () => void;
};

const InviteModalCreateTeam: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);
  const [newTeamName, setNewTeamName] = useState('');
  const [members, setMembers] = useState<Member[]>([{ email: '', role: 'editor' }]);
  const [shareProject, setShareProject] = useState(true);
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [loading, setLoading] = useState(false);

  const createTeam = async () => {
    setLoading(true);

    const newTeam: Irisub.Team = { id: nanoid(), name: newTeamName };

    await gateway.upsertTeam(newTeam);

    if (currentProject && shareProject) {
      setCurrentProject({ ...currentProject, team_id: newTeam.id });

      if (currentProject && members.length > 0) {
        await gateway.sendInvitations(newTeam.id, members);
      }
    }

    setLoading(false);
    props.close();
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
    if (members.length === 0)
      return <p className="text-slate-11 text-sm font-semibold">Not inviting any members.</p>;

    return members.map((member, index) => (
      <div
        key={index}
        className="flex border-b border-x border-slate-6 [&:not(:first-child)]:border-t"
      >
        <input
          className="w-full px-2 py-0 inline leading-none bg-slate-3 text-slate-12 outline-none"
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
          <Select.Trigger className="w-36 inline-flex items-center leading-none justify-center gap-1 cursor-pointer outline-none capitalize text-slate-12 bg-slate-3 p-2 hover:bg-slate-4 border-x border-slate-6">
            <Select.Value>{member.role}</Select.Value>
            <Select.Icon className="text-slate-12">
              <IconChevronDown />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal className="z-50">
            <Select.Content className="overflow-hidden bg-slate-6" position="item-aligned">
              <Select.Viewport className="p-px">
                <Select.Group>
                  <Select.Item
                    value="editor"
                    className="cursor-pointer select-none flex items-center text-sm h-7 pl-6 pt-2 pb-2 relative text-slate-11 bg-slate-1 data-[highlighted]:outline-none data-[highlighted]:text-slate-12 data-[highlighted]:bg-slate-4"
                  >
                    <Select.ItemText>Editor</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                      <IconCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    value="owner"
                    className="cursor-pointer select-none flex items-center text-sm h-7 pl-6 pt-2 pb-2 relative text-slate-11 bg-slate-1 data-[highlighted]:outline-none data-[highlighted]:text-slate-12 data-[highlighted]:bg-slate-4"
                  >
                    <Select.ItemText>Owner</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                      <IconCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <button
          className="text-red-500 hover:text-red-600 px-2"
          onClick={() => deleteMember(index)}
        >
          <IconTrash width={18} height={18} />
        </button>
      </div>
    ));
  };

  return (
    <>
      <div className="w-full p-4">
        <div className="flex flex-col items-start">
          <label className="text-slate-12 text-sm font-semibold mb-1">Team name</label>
          <input
            className="w-full px-2 py-1.5 inline bg-slate-3 text-slate-12 rounded-sm outline-none border border-slate-7 focus:border-slate-8"
            placeholder={TEAM_NAME_PLACEHOLDER}
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="py-4">
          <div className="flex justify-between items-baseline text-slate-12 text-sm font-semibold py-2">
            <label className="text-slate-12 text-sm font-semibold">Invite members</label>
            <Button onClick={() => setMembers([...members, { email: '', role: 'editor' }])}>
              <IconPlus width={18} height={18} />
              <span className="pl-1">Add member</span>
            </Button>
          </div>
          {renderMemberRows()}
        </div>

        <div className="flex flex-col items-start text-slate-12">
          <span className="text-sm font-semibold py-2">Share project</span>
          <div className="flex items-center pl-4 gap-2 select-none">
            <Checkbox.Root
              className="w-6 h-6 flex items-center justify-center border text-slate-12 bg-slate-3 hover:bg-slate-4 border-slate-7 hover:border-slate-8 rounded-sm"
              id="shareTeamCurrentCheck"
              checked={shareProject}
              onCheckedChange={(checked) => setShareProject(checked === true)}
            >
              <Checkbox.Indicator>
                <IconCheck width={20} height={20} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label htmlFor="shareTeamCurrentCheck" className="text-slate-12">
              Share{' '}
              <span className={`text-${accent}-500 font-semibold`}>{currentProject?.title}</span>{' '}
              with this team
            </label>
          </div>
        </div>
      </div>
      <div className="text-slate-11 bg-slate-2 px-4 py-2 font-medium text-xs border-t border-slate-6">
        <div className="flex gap-2 justify-end">
          <Button onClick={props.close}>Cancel</Button>
          <Button accent disabled={loading} onClick={createTeam}>
            Create Team
          </Button>
        </div>
      </div>
    </>
  );
};

export default InviteModalCreateTeam;
