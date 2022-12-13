import Link from "next/link";
import styles from "../styles/components/Header.module.scss";

type Props = {};

const Header: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.group}>
          <Link href="/" className={styles.brand}>
            <span>IRISUB</span>
          </Link>
        </div>
        <div className={styles.group}>top right</div>
      </header>
    </div>
  );
};

export default Header;
