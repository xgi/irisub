import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/project";
import { userIdState } from "../store/states";
import styles from "../styles/components/Header.module.scss";
import LoginModal from "./auth/LoginModal";
import Button from "./Button";
import { IconCloud, IconInvite, IconPencil } from "./Icons";

type Props = {};

const Header: React.FC<Props> = (props: Props) => {
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [userId, setUserId] = useRecoilState(userIdState);
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
          <IconPencil />
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
          {userId}
          <Button onClick={() => setLoginModalOpen(true)}>
            <span>
              <IconInvite />
              Invite Members
            </span>
          </Button>
          <Button accent={true} onClick={() => setLoginModalOpen(true)}>
            <span>
              <IconCloud />
              Save Workspace
            </span>
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
