import styles from "../styles/components/Button.module.scss";
import { classNames } from "../util/layout";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
  const customProps = { ...props };
  // rome-ignore lint/performance/noDelete: <explanation>
  delete customProps.accent;

  return (
    <button
      className={classNames(styles.button, props.accent ? styles.accent : "")}
      {...customProps}
    />
  );
};

export default Button;
