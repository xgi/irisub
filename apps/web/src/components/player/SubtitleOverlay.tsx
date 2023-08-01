import { useRecoilValue } from 'recoil';
import styles from '../../styles/components/SubtitleOverlay.module.scss';
import { visibleCuesSelector } from '../../store/selectors';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const SubtitleOverlay: React.FC<Props> = (props: Props) => {
  const visibleCues = useRecoilValue(visibleCuesSelector);

  const renderLines = () => {
    if (visibleCues.length === 0) return '';

    const lines = visibleCues[0].text.split('␤');

    return (
      <div className={styles.subtitleGroup}>
        {lines.map((line, index) => (
          <span key={index} className={styles.subtitleLine}>
            {line}
          </span>
        ))}
      </div>
    );
  };

  return <div className={styles.container}>{renderLines()}</div>;
};

export default SubtitleOverlay;
