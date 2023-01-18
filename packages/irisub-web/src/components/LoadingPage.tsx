import styles from "../styles/components/LoadingPage.module.scss";

type Props = {};

const LoadingPage: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.spin} />
    </div>
  );
};

export default LoadingPage;
