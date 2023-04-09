import styles from '../styles/components/LoadingContainer.module.scss';

type Props = unknown;

const LoadingContainer: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.spin} />
    </div>
  );
};

export default LoadingContainer;
