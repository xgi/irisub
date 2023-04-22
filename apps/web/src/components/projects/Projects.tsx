import { useEffect, useState } from 'react';
import styles from '../../styles/components/Projects.module.scss';
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
      <table style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '100%' }}>Name</th>
            <th style={{ width: '300px' }}>Created</th>
            <th style={{ width: '80px' }} />
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} onClick={() => handleClickProject(project)}>
              <td>
                {project.title}{' '}
                {project.id === currentProject?.id ? (
                  <span className={styles.sub}>(current)</span>
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
    <div className={styles.container} style={props.hidden ? { display: 'none' } : {}}>
      {loading ? (
        <LoadingContainer />
      ) : (
        <>
          {' '}
          <section>
            <div className={styles.left}>
              <h3>Your Projects</h3>
            </div>
            <div className={styles.right}>
              {ownedProjects.length > 0 ? (
                renderProjects(ownedProjects)
              ) : (
                <p>You haven't created any projects.</p>
              )}
              <Button
                accent
                className={styles.newProject}
                onClick={handleNewProject}
                disabled={creatingNewProject}
              >
                {creatingNewProject ? 'Loading...' : 'New Project'}
              </Button>
            </div>
          </section>
          <section>
            <div className={styles.left}>
              <h3>Team Projects</h3>
            </div>
            <div className={styles.right}>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div key={team.teamName} className={styles.team}>
                    <p>{team.teamName}</p>
                    {renderProjects(team.projects)}
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

export default Projects;
