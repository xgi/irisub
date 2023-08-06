import { Tooltip } from 'react-tooltip';

import styles from '../../styles/components/Settings.module.scss';
import { IconCircle, IconComputer, IconMoon, IconSun } from '../Icons';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { accentState, themeState } from '../../store/theme';
import { editorShowMsState, editorShowTimelineState, userIdState } from '../../store/states';
import Toggle from './Toggle';
import Button from '../Button';
import { getAuth } from 'firebase/auth';

type Props = {
  hidden?: boolean;
};

const Settings: React.FC<Props> = (props: Props) => {
  const [theme, setTheme] = useRecoilState(themeState);
  const [accent, setAccent] = useRecoilState(accentState);
  const [showMs, setShowMs] = useRecoilState(editorShowMsState);
  const [showTimeline, setShowTimeline] = useRecoilState(editorShowTimelineState);
  const setUserId = useSetRecoilState(userIdState);

  const getThemeText = () => {
    if (theme === 'dark') return 'Dark';
    if (theme === 'light') return 'Light';

    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)');
    return systemIsDark ? 'System (Dark)' : 'System (Light)';
  };

  const renderOptionsRow = (
    id: string,
    compareWith: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setter: (value: any) => void,
    options: { value: string; text: string; icon: JSX.Element }[]
  ) => {
    return (
      <div className={styles.optionsRow}>
        {options.map((option) => {
          const tooltipId = `tt-${id}-${option.value}`;
          return (
            <div key={option.value}>
              <button
                className={compareWith === option.value ? styles.active : ''}
                data-tooltip-id={tooltipId}
                data-tooltip-content={option.text}
                onClick={() => setter(option.value)}
              >
                <span>{option.icon}</span>
              </button>
              <Tooltip id={tooltipId} className="tooltip" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.container} style={props.hidden ? { display: 'none' } : {}}>
      <section>
        <div className={styles.left}>
          <h3>Theme</h3>
        </div>
        <div className={styles.right}>
          <h4>Background</h4>
          <p>{getThemeText()}</p>

          {renderOptionsRow('background', theme, setTheme, [
            { value: 'system', text: 'System', icon: <IconComputer width={24} height={24} /> },
            { value: 'light', text: 'Light', icon: <IconSun width={24} height={24} /> },
            { value: 'dark', text: 'Dark', icon: <IconMoon width={24} height={24} /> },
          ])}

          <h4>Accent</h4>
          <p style={{ textTransform: 'capitalize' }}>{accent}</p>
          {renderOptionsRow('accent', accent, setAccent, [
            {
              value: 'green',
              text: 'Green',
              icon: <IconCircle width={24} height={24} color="#10b981" />,
            },
            {
              value: 'teal',
              text: 'Teal',
              icon: <IconCircle width={24} height={24} color="#14b8a6" />,
            },
            {
              value: 'blue',
              text: 'Blue',
              icon: <IconCircle width={24} height={24} color="#3b82f6" />,
            },
            {
              value: 'indigo',
              text: 'Indigo',
              icon: <IconCircle width={24} height={24} color="#6366f1" />,
            },
            {
              value: 'purple',
              text: 'Purple',
              icon: <IconCircle width={24} height={24} color="#8b5cf6" />,
            },
            {
              value: 'yellow',
              text: 'Yellow',
              icon: <IconCircle width={24} height={24} color="#f59e0b" />,
            },
            {
              value: 'orange',
              text: 'Orange',
              icon: <IconCircle width={24} height={24} color="#f97316" />,
            },
            {
              value: 'red',
              text: 'Red',
              icon: <IconCircle width={24} height={24} color="#ef4444" />,
            },
            {
              value: 'pink',
              text: 'Pink',
              icon: <IconCircle width={24} height={24} color="#ec4899" />,
            },
          ])}
        </div>
      </section>

      <section>
        <div className={styles.left}>
          <h3>Editor</h3>
        </div>
        <div className={styles.right}>
          <h4>Timetable</h4>
          <Toggle
            value={showMs}
            label={'Show milliseconds in timestamps'}
            onChange={(value) => setShowMs(value)}
          />
          <h4>Timeline</h4>
          <Toggle
            value={showTimeline}
            label={'Show timeline'}
            onChange={(value) => setShowTimeline(value)}
          />
        </div>
      </section>

      <section>
        <div className={styles.left}>
          <h3>Account</h3>
        </div>
        <div className={styles.right}>
          <Button
            style={{ marginTop: '0.5rem' }}
            onClick={() => {
              setUserId(null);
              getAuth().signOut();
            }}
          >
            Logout
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
