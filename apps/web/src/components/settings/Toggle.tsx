import styles from '../../styles/components/Toggle.module.scss';
import { classNames } from '../../util/layout';

type Props = {
  value?: boolean;
  label?: string;
  onChange?: (value: boolean) => void;
};

const Toggle: React.FC<Props> = (props: Props) => {
  return (
    <div
      className={styles.row}
      onClick={() => {
        if (props.onChange) props.onChange(!props.value);
      }}
    >
      <span className={styles.toggle}>
        <span className={classNames(styles.handle, props.value ? styles.on : '')}></span>
      </span>
      <span className={styles.label}>{props.label}</span>
    </div>
  );
};

export default Toggle;
