import styles from '../styles/components/SubtitleOverlay.module.scss';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const SubtitleOverlay: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <p>Example Subtitle</p>
    </div>
  );
};

export default SubtitleOverlay;
