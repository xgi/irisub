import { Tooltip } from 'react-tooltip';

import styles from '../../styles/components/Settings.module.scss';
import { IconComputer, IconMoon, IconSun } from '../Icons';
import { useRecoilState } from 'recoil';
import { themeState } from '../../store/theme';

type Props = {
  hidden?: boolean;
};

const Settings: React.FC<Props> = (props: Props) => {
  const [theme, setTheme] = useRecoilState(themeState);

  const getThemeText = () => {
    if (theme === 'dark') return 'Dark';
    if (theme === 'light') return 'Light';

    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)');
    return systemIsDark ? 'System (Dark)' : 'System (Light)';
  };

  return (
    <div className={styles.container} style={props.hidden ? { display: 'none' } : {}}>
      <section>
        <div className={styles.left}>
          <h3>Theme</h3>
          <p>Customize the application theme.</p>
        </div>
        <div className={styles.right}>
          <h4>Background</h4>
          <p>{getThemeText()}</p>
          <div className={styles.optionsRow}>
            <button
              className={theme === 'system' ? styles.active : ''}
              data-tooltip-id="tt-background-system"
              data-tooltip-content="System"
              onClick={() => setTheme('system')}
            >
              <span>
                <IconComputer width={24} height={24} />
              </span>
            </button>
            <button
              className={theme === 'light' ? styles.active : ''}
              data-tooltip-id="tt-background-light"
              data-tooltip-content="Light"
              onClick={() => setTheme('light')}
            >
              <span>
                <IconSun width={24} height={24} />
              </span>
            </button>
            <button
              className={theme === 'dark' ? styles.active : ''}
              data-tooltip-id="tt-background-dark"
              data-tooltip-content="Dark"
              onClick={() => setTheme('dark')}
            >
              <span>
                <IconMoon width={24} height={24} />
              </span>
            </button>

            <Tooltip id="tt-background-system" className="tooltip" />
            <Tooltip id="tt-background-light" className="tooltip" />
            <Tooltip id="tt-background-dark" className="tooltip" />
          </div>

          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
          <p>this is the right side</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
