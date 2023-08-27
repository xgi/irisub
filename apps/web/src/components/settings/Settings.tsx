import { Tooltip } from 'react-tooltip';

import { IconCircle, IconComputer, IconMoon, IconSun } from '../Icons';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { accentState, themeState } from '../../store/theme';
import { editorShowMsState, editorShowTimelineState, userIdState } from '../../store/states';
import Toggle from './Toggle';
import Button from '../Button';
import { getAuth } from 'firebase/auth';
import { classNames } from '../../util/layout';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

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
      <div className="flex">
        {options.map((option) => {
          const tooltipId = `tt-${id}-${option.value}`;
          return (
            <div key={option.value}>
              <button
                className={classNames(
                  'cursor-pointer p-1 border-none rounded m-0.5',
                  compareWith === option.value ? 'bg-slate-5' : 'bg-transparent hover:bg-slate-4'
                )}
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
    <div className="w-full h-full flex flex-col items-center text-slate-12 bg-slate-1 overflow-y-scroll">
      <section className="w-full max-w-screen-2xl m-4 grid grid-cols-3">
        <div className="col-span-1 select-none mt-3">
          <h3 className="text-2xl mb-0 font-semibold">Theme</h3>
        </div>
        <div className="col-span-2 mt-3">
          <h4 className="text-xl font-semibold mb-2">Background</h4>
          <p className="mb-2">{getThemeText()}</p>

          {renderOptionsRow('background', theme, setTheme, [
            { value: 'system', text: 'System', icon: <IconComputer width={24} height={24} /> },
            { value: 'light', text: 'Light', icon: <IconSun width={24} height={24} /> },
            { value: 'dark', text: 'Dark', icon: <IconMoon width={24} height={24} /> },
          ])}

          <h4 className="text-xl font-semibold mt-4 mb-2">Accent</h4>
          <p className="mb-2 capitalize">{accent}</p>
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

      <section className="w-full max-w-screen-2xl m-4 grid grid-cols-3 border-t border-slate-6">
        <div className="col-span-1 select-none mt-3">
          <h3 className="text-2xl mb-0 font-semibold">Editor</h3>
        </div>
        <div className="col-span-2 mt-3">
          <h4 className="text-xl font-semibold mb-2">Timetable</h4>
          <Toggle
            value={showMs}
            label={'Show milliseconds in timestamps'}
            onChange={(value) => setShowMs(value)}
          />
          <h4 className="text-xl font-semibold mt-4 mb-2">Timeline</h4>
          <Toggle
            value={showTimeline}
            label={'Show timeline'}
            onChange={(value) => setShowTimeline(value)}
          />
        </div>
      </section>

      <section className="w-full max-w-screen-2xl m-4 grid grid-cols-3 border-t border-slate-6">
        <div className="col-span-1 select-none mt-3">
          <h3 className="text-2xl mb-0 font-semibold">Account</h3>
        </div>
        <div className="col-span-2 mt-3">
          <Button
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
