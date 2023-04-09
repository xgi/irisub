import styles from '../styles/components/Footer.module.scss';

type Props = unknown;

const Footer: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.footer}>
        <div className={styles.group}>
          <span>bottom left</span>
        </div>
        <div className={styles.group}>
          <span>bottom right</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
