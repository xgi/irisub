import { useEffect, useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { IconCheck, IconChevronDown } from '../Icons';
import Button from '../Button';
import React from 'react';
import { gateway } from '../../services/gateway';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentProjectState } from '../../store/states';
import { Gateway } from '@irisub/shared';
import { accentState } from '../../store/theme';

type Props = {
  close: () => void;
};

const InviteModalExistingTeam: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);
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
      <div className="w-full p-4">
        <div className="flex items-center gap-4">
          <Select.Root
            value={selectedTeamId || undefined}
            onValueChange={(value) => setSelectedTeamId(value)}
          >
            <Select.Trigger className="w-full inline-flex items-center justify-center gap-1 h-8 cursor-pointer outline-none border border-slate-6 text-slate-12 bg-slate-3 p-2 hover:bg-slate-4 hover:border-slate-8 focus:bg-slate-4 focus:border-slate-8">
              <Select.Value>
                {teams.find((team) => team.id === selectedTeamId)?.name || 'Select team'}
              </Select.Value>
              <Select.Icon className="text-slate-12">
                <IconChevronDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal className="z-50">
              <Select.Content className="overflow-hidden bg-slate-6" position="item-aligned">
                <Select.Viewport className="p-px">
                  <Select.Group>
                    {teams.map((team) => (
                      <Select.Item
                        className="cursor-pointer select-none flex items-center text-sm h-7 pl-6 pt-2 pb-2 relative text-slate-11 bg-slate-1 data-[highlighted]:outline-none data-[highlighted]:text-slate-12 data-[highlighted]:bg-slate-4"
                        key={team.id}
                        value={team.id}
                      >
                        <Select.ItemText>{team.name}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
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

        <div className="flex text-sm mt-4 mx-2">
          <span className="text-slate-12">
            The project{' '}
            <span className={`text-${accent}-500 font-semibold`}>{currentProject?.title}</span> will
            be accessible by team members according to their roles.
          </span>
        </div>
      </div>
      <div className="text-slate-11 bg-slate-2 px-4 py-2 font-medium text-xs border-t border-slate-6">
        <div className="flex gap-2 justify-end">
          <Button onClick={props.close}>Cancel</Button>
          <Button accent disabled={loading} onClick={inviteTeam}>
            Invite Team
          </Button>
        </div>
      </div>
    </>
  ) : (
    <div className="py-12 px-4">You haven't joined any teams.</div>
  );
};

export default InviteModalExistingTeam;
