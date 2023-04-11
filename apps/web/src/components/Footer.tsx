import { useRecoilValue } from 'recoil';
import styles from '../styles/components/Footer.module.scss';
import { currentProjectIdState, userIdState } from '../store/states';

type Props = unknown;

const Footer: React.FC<Props> = (props: Props) => {
  const userId = useRecoilValue(userIdState);
  const currentProjectId = useRecoilValue(currentProjectIdState);

  return (
    <div className={styles.container}>
      <div className={styles.footer}>
        <div className={styles.group}>
          <span>{currentProjectId}</span>
        </div>
        <div className={styles.group}>
          <span>{userId}</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
