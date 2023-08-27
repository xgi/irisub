import { useRecoilValue } from 'recoil';
import { classNames } from '../../util/layout';
import { accentState } from '../../store/theme';

type Props = {
  value?: boolean;
  label?: string;
  onChange?: (value: boolean) => void;
};

const Toggle: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);

  return (
    <div
      className="group cursor-pointer select-none flex items-center text-slate-11 hover:text-slate-12"
      onClick={() => {
        if (props.onChange) props.onChange(!props.value);
      }}
    >
      <span className="box-content relative flex items-center justify-center w-[2.6rem] h-[1.2rem] rounded-full p-0 mr-4 border-2 border-slate-7 group-hover:border-slate-8">
        <span
          className={classNames(
            'box-content absolute flex flex-shrink-0 w-[0.8rem] h-[0.8rem] top-0 left-0 rounded-full pointer-events-none m-[0.2rem] transition-[left] duration-200 ease-in-out',
            props.value ? `bg-${accent}-500 left-[1.4rem]` : 'bg-slate-6 '
          )}
        ></span>
      </span>
      <span className="font-semibold">{props.label}</span>
    </div>
  );
};

export default Toggle;
