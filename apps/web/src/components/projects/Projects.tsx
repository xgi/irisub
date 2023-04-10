import { useEffect, useState } from 'react';
import styles from '../../styles/components/Projects.module.scss';
import { Irisub } from '@irisub/shared';
import LoadingContainer from '../LoadingContainer';
import { gateway } from '../../services/gateway';
import Button from '../Button';
import { useSetRecoilState } from 'recoil';
import { currentProjectIdState, currentTrackIdState } from '../../store/states';
import { IconBars3 } from '../Icons';
import { Tooltip } from 'react-tooltip';

type Props = {
  hidden?: boolean;
};

const Projects: React.FC<Props> = (props: Props) => {
  const setCurrentProjectId = useSetRecoilState(currentProjectIdState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const [ownedProjects, setOwnedProjects] = useState<Irisub.Project[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<Irisub.Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingNewProject, setCreatingNewProject] = useState(false);

  useEffect(() => {
    if (!props.hidden) {
      setLoading(true);

      gateway.getProjects().then((data) => {
        setOwnedProjects(data.owned);
        setJoinedProjects(data.joined);
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

  const handleClickProjectMenu = (project: Irisub.Project) => {
    console.log(`menu for project ${project.id}`);
  };

  const handleClickProject = (project: Irisub.Project) => {
    setCurrentProjectId(project.id);
  };

  const renderProjects = (projects: Irisub.Project[]) => {
    return (
      <table>
        <thead>
          <tr>
            <th style={{ width: '100%' }}>Name</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} onClick={() => handleClickProject(project)}>
              <td>{project.title}</td>
              <td style={{ textAlign: 'right' }}>
                <button
                  data-tooltip-id={`tt-project-actions-${project.id}`}
                  data-tooltip-content={'Project Actions'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickProjectMenu(project);
                  }}
                >
                  <span>
                    <IconBars3 width={24} height={24} />
                  </span>
                </button>

                <Tooltip id={`tt-project-actions-${project.id}`} className="tooltip" place="left" />
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
              <h3>Shared With You</h3>
            </div>
            <div className={styles.right}>
              {joinedProjects.length > 0 ? (
                renderProjects(joinedProjects)
              ) : (
                <p>You haven't joined any projects.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Projects;
