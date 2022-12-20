import * as React from "react";
import styles from "../styles/components/Header.module.scss";

type Props = {};

const Header: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.group}>
          <a href="/" className={styles.brand}>
            <span>IRISUB</span>
          </a>
        </div>
        <div className={styles.group}>top right</div>
      </header>
    </div>
  );
};

export default Header;
