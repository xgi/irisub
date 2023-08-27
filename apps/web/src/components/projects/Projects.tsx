import { useEffect, useState } from 'react';
import { Gateway, Irisub } from '@irisub/shared';
import LoadingContainer from '../LoadingContainer';
import { gateway } from '../../services/gateway';
import Button from '../Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentProjectIdState,
  currentProjectState,
  currentTrackIdState,
} from '../../store/states';
import { formatDate } from '../../util/layout';
import ProjectActionsDropdown from './ProjectActionsDropdown';

type Props = {
  hidden?: boolean;
};

type GetProjectsResponseBodyProjects = Gateway.GetProjectsResponseBody['owned'];

const Projects: React.FC<Props> = (props: Props) => {
  const setCurrentProjectId = useSetRecoilState(currentProjectIdState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const currentProject = useRecoilValue(currentProjectState);
  const [ownedProjects, setOwnedProjects] = useState<Gateway.GetProjectsResponseBody['owned']>([]);
  const [teams, setTeams] = useState<Gateway.GetProjectsResponseBody['teams']>([]);
  const [loading, setLoading] = useState(false);
  const [creatingNewProject, setCreatingNewProject] = useState(false);

  useEffect(() => {
    if (!props.hidden) {
      setLoading(true);

      gateway.getProjects().then((data: Gateway.GetProjectsResponseBody) => {
        setOwnedProjects(data.owned);
        setTeams(data.teams);
        setLoading(false);
      });
    }
  }, [props.hidden]);

  const handleNewProject = () => {
    setCreatingNewProject(true);

    gateway
      .setupNewProject()
      .then(({ project, track }) => {
        setCurrentProjectId(project.id);
        setCurrentTrackId(track.id);
      })
      .finally(() => setCreatingNewProject(false));
  };

  const handleClickProject = (project: Irisub.Project) => {
    setCurrentProjectId(project.id);
  };

  const renderProjects = (projects: GetProjectsResponseBodyProjects) => {
    return (
      <table className="table-fixed w-full text-left border border-slate-6">
        <thead>
          <tr className="[&>th]:px-4 h-7 text-slate-11">
            <th style={{ width: '100%' }}>Name</th>
            <th style={{ width: '300px' }}>Created</th>
            <th style={{ width: '80px' }} />
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:cursor-pointer hover:bg-slate-4 [&>td]:px-4 h-10 border-t border-slate-6"
              onClick={() => handleClickProject(project)}
            >
              <td>
                {project.title}{' '}
                {project.id === currentProject?.id ? (
                  <span className="text-slate-11 text-sm">(current)</span>
                ) : (
                  ''
                )}
              </td>
              <td>{formatDate(new Date(project.created_at))}</td>
              <td style={{ textAlign: 'right' }}>
                <ProjectActionsDropdown project={project} />
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
      ) : (
        <>
          <section className="w-full max-w-screen-2xl m-4 grid grid-cols-3">
            <div className="col-span-1 select-none">
              <h3 className="text-2xl mb-0 font-semibold">Your Projects</h3>
            </div>
            <div className="col-span-2 mt-3">
              {ownedProjects.length > 0 ? (
                renderProjects(ownedProjects)
              ) : (
                <p className="font-semibold">You haven't created any projects.</p>
              )}
              <Button
                accent
                className="mt-4"
                onClick={handleNewProject}
                disabled={creatingNewProject}
              >
                {creatingNewProject ? 'Loading...' : 'New Project'}
              </Button>
            </div>
          </section>
          <section className="w-full max-w-screen-2xl m-4 grid grid-cols-3 border-t border-slate-6">
            <div className="col-span-1 select-none mt-3">
              <h3 className="text-2xl mb-0 font-semibold">Team Projects</h3>
            </div>
            <div className="col-span-2 mt-3">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div key={team.teamName} className="mb-2">
                    <p className="font-bold mb-2">{team.teamName}</p>
                    {renderProjects(team.projects)}
                  </div>
                ))
              ) : (
                <p className="font-semibold">You haven't joined any teams.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Projects;
