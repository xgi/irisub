import { useRecoilValue } from 'recoil';
import { classNames } from '../util/layout';
import { accentState } from '../store/theme';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
  const accent = useRecoilValue(accentState);
  const customProps = { ...props };
  delete customProps.accent;

  return (
    <button
      {...customProps}
      className={classNames(
        // styles.button,
        'inline-flex items-center justify-center font-semibold py-1 px-4 border rounded-sm [&>span]:inline-flex [&>span]:justify-center [&>span]:items-center [&>span]:gap-1 text-sm',
        props.accent
          ? `bg-${accent}-600 hover:bg-${accent}-500 text-slate-12 border-${accent}-600 hover:border-${accent}-500`
          : 'bg-slate-3 hover:bg-slate-4 text-slate-11 hover:text-slate-12 border-slate-7 hover:border-slate-8',
        props.className || ''
      )}
    />
  );
};

export default Button;
