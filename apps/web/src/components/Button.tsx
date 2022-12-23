import styles from "../styles/components/Button.module.scss";
import { classNames } from "../util/layout";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
  return (
    <button className={classNames(styles.button, props.accent ? styles.accent : "")} {...props} />
  );
};

export default Button;
