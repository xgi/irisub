import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/states";
import styles from "../styles/components/Header.module.scss";
import LoginModal from "./auth/LoginModal";

type Props = {};

const Header: React.FC<Props> = (props: Props) => {
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [editingProjectTitle, setEditingProjectTitle] = useState(false);
  const [tempProjectTitle, setTempProjectTitle] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const updateProjectTitle = () => {
    setEditingProjectTitle(false);
    if (currentProject) {
      setCurrentProject({ ...currentProject, title: tempProjectTitle });
    }
  };

  useEffect(() => {
    if (editingProjectTitle && currentProject) setTempProjectTitle(currentProject.title || "");
  }, [editingProjectTitle]);

  const renderProjectTitle = () => {
    if (!currentProject) return;

    if (editingProjectTitle) {
      return (
        <form onSubmit={() => updateProjectTitle()} className={styles.project}>
          <input
            value={tempProjectTitle}
            placeholder="Untitled project"
            onChange={(e) => setTempProjectTitle(e.target.value)}
            onFocus={(e) => e.target.select()}
            onBlur={() => updateProjectTitle()}
            onSubmit={(e) => console.log("here")}
            autoFocus
          />
        </form>
      );
    } else {
      return (
        <span onClick={() => setEditingProjectTitle(true)} className={styles.project}>
          {currentProject?.title || "Untitled project"}
        </span>
      );
    }
  };

  return (
    <div className={styles.container}>
      <LoginModal isOpen={loginModalOpen} handleClose={() => setLoginModalOpen(false)} />
      <header className={styles.header}>
        <div className={styles.group}>
          <a href="/" className={styles.brand}>
            <span>IRISUB</span>
          </a>
          {renderProjectTitle()}
        </div>
        <div className={styles.group}>
          <button onClick={() => setLoginModalOpen(true)}>show login modal</button>
        </div>
      </header>
    </div>
  );
};

export default Header;
