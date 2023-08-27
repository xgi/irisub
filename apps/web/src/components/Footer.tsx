import { useRecoilValue } from 'recoil';
import { currentProjectIdState, userIdState } from '../store/states';

type Props = unknown;

const Footer: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);
  const currentProjectId = useRecoilValue(currentProjectIdState);

  return (
    <div className="h-auto w-full overflow-hidden text-slate-11 bg-slate-1 border-t border-slate-6">
      <div className="flex flex-1 p-2 justify-between items-center">
        <div>
          <span>{currentProjectId}</span>
        </div>
        <div>
          <span>{userId}</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
