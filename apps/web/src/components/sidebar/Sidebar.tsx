import { Link, LinkProps, useRoute } from 'wouter';
import { PropsWithChildren } from 'react';
import { IconGroup } from '../Icons';
import { classNames } from '../../util/layout';

type Props = unknown;

const Sidebar: React.FC<Props> = () => {
  return (
    <div className="w-auto h-auto text-slate-11 bg-slate-1 border-r border-slate-6">
      <aside className="flex flex-col justify-between h-full select-none">
        <nav className="flex flex-nowrap flex-none flex-col">
          <SidebarLink href="/">
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
            <span className="mt-1.5">Editor</span>
          </SidebarLink>
          <SidebarLink href="/projects">
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
            <span className="mt-1.5">Projects</span>
          </SidebarLink>
          <SidebarLink href="/teams">
            <IconGroup width={24} height={24} />
            <span className="mt-1.5">Teams</span>
          </SidebarLink>
          <SidebarLink href="/settings">
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
            <span className="mt-1.5">Settings</span>
          </SidebarLink>
        </nav>
      </aside>
    </div>
  );
};

const SidebarLink = (props: PropsWithChildren<LinkProps>) => {
  const [isActive] = useRoute(props.href || '');
  return (
    <Link {...props}>
      <button
        className={classNames(
          'font-semibold relative p-4 flex flex-col flex-1 items-center justify-center border-none cursor-pointer text-sm text-slate-11 bg-slate-1 hover:text-slate-12',
          isActive ? 'text-slate-12 bg-slate-5' : 'hover:bg-slate-4'
        )}
      >
        {props.children}
      </button>
    </Link>
  );
};

export default Sidebar;
