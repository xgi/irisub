import { useRecoilState } from "recoil";
import { playerPlayingState } from "../../store/player";
import { currentNavPageState } from "../../store/states";
import styles from "../../styles/components/Sidebar.module.scss";
import { NavPage } from "../../util/constants";
import { classNames } from "../../util/layout";

type Props = {};

const Sidebar: React.FC<Props> = (props: Props) => {
  const [currentNavPage, setCurrentNavPage] =
    useRecoilState(currentNavPageState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);

  const goToPage = (navPage: NavPage) => {
    setCurrentNavPage(navPage);
    if (playerPlaying) setPlayerPlaying(false);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <nav>
          <a
            className={classNames(
              currentNavPage === NavPage.Editor ? styles.active : ""
            )}
            onClick={() => goToPage(NavPage.Editor)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>Editor</span>
          </a>
          <a
            className={classNames(
              currentNavPage === NavPage.Projects ? styles.active : ""
            )}
            onClick={() => goToPage(NavPage.Projects)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>Projects</span>
          </a>
          <a
            className={classNames(
              currentNavPage === NavPage.Settings ? styles.active : ""
            )}
            onClick={() => goToPage(NavPage.Settings)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </a>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
