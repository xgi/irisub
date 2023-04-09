import styles from '../styles/components/Button.module.scss';
import { classNames } from '../util/layout';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
  const customProps = { ...props };
  delete customProps.accent;

  return (
    <button
      {...customProps}
      className={classNames(
        styles.button,
        props.accent ? styles.accent : '',
        props.className || ''
      )}
    />
  );
};

export default Button;
