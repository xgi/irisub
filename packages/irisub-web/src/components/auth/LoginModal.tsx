import Modal from "../Modal";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from "firebase/auth";
import { useRecoilValue } from "recoil";
import { currentProjectIdState } from "../../store/states";
import { IconArrowLeft, IconEmail, IconGitHub, IconGoogle, IconMicrosoft, IconX } from "../Icons";
import styles from "../../styles/components/LoginModal.module.scss";
import { useState } from "react";

enum ProviderName {
  GOOGLE,
  MICROSOFT,
  GITHUB,
}

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  callback?: () => void;
};

const LoginModal: React.FC<Props> = (props: Props) => {
  const currentProjectId = useRecoilValue(currentProjectIdState);
  const [showingEmailForm, setShowingEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const close = (successful = true) => {
    setEmail("");
    setShowingEmailForm(false);
    setMagicLinkSent(false);

    props.handleClose();
    if (successful && props.callback) props.callback();
  };

  const getProvider = (providerName: ProviderName) => {
    switch (providerName) {
      case ProviderName.GOOGLE:
        return new GoogleAuthProvider();
      case ProviderName.MICROSOFT:
        return new OAuthProvider("microsoft.com");
      case ProviderName.GITHUB:
        return new GithubAuthProvider();
    }
  };

  const handleLogin = (providerName: ProviderName) => {
    const auth = getAuth();
    const prevUser = auth.currentUser;
    if (!prevUser) return;

    // TODO: do for all projects. Also maybe copy all project data instead of just the owner?
    // set(ref(getDatabase(), `projects/${currentProjectId}/owner`), "");

    const provider = getProvider(providerName);

    signInWithPopup(auth, provider)
      .then((loginResult) => {
        const currentUser = loginResult.user;
        // set(ref(getDatabase(), `projects/${currentProjectId}/owner`), currentUser.uid);
      })
      .then(() => close())
      .catch((error) => {
        console.log("Sign In Error", error);
        // set(ref(getDatabase(), `projects/${currentProjectId}/owner`), prevUser.uid);
      });
  };

  const handleEmailPasswordless = () => {
    setLoading(true);

    const actionCodeSettings = {
      url: "http://localhost:5173/finishSignUp?cartId=1234",
      handleCodeInApp: true,
    };

    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        setMagicLinkSent(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const renderOptionButtons = () => {
    return (
      <>
        <button className={styles.providerButton} onClick={() => handleLogin(ProviderName.GOOGLE)}>
          <IconGoogle width={18} height={18} />
          <span>Continue with Google</span>
        </button>
        <button
          className={styles.providerButton}
          onClick={() => handleLogin(ProviderName.MICROSOFT)}
        >
          <IconMicrosoft width={18} height={18} />
          <span>Continue with Microsoft</span>
        </button>
        <button className={styles.providerButton} onClick={() => handleLogin(ProviderName.GITHUB)}>
          <IconGitHub width={18} height={18} />
          <span>Continue with GitHub</span>
        </button>
        <button className={styles.providerButton} onClick={() => setShowingEmailForm(true)}>
          <IconEmail width={18} height={18} />
          <span>Continue with email</span>
        </button>
      </>
    );
  };

  const renderEmailForm = () => {
    if (magicLinkSent) {
      return (
        <div className={styles.sentContainer}>
          <h2>Email sent!</h2>
          <p>
            We sent a verification email to <b>{email}</b>. Please check your inbox and click the
            link to finish signing in.
          </p>
        </div>
      );
    }

    return (
      <>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEmailPasswordless();
          }}
          autoFocus
        />
        <div className={styles.buttonRow}>
          <a className={styles.backLink} onClick={() => setShowingEmailForm(false)}>
            <IconArrowLeft />
            All login options
          </a>
          <button className={styles.actionButton} onClick={handleEmailPasswordless}>
            Send sign-in link
          </button>
        </div>
      </>
    );
  };

  const renderLoader = () => {
    return (
      <div className={styles.loading}>
        <div className={styles.spin} />
      </div>
    );
  };

  return !props.isOpen ? null : (
    <Modal isOpen={props.isOpen} handleClose={() => close(false)}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Login to Irisub</h3>
          <button className={styles.exit}>
            <IconX width={22} height={22} onClick={() => close(false)} />
          </button>
        </div>

        <div className={styles.inner}>
          {loading ? renderLoader() : showingEmailForm ? renderEmailForm() : renderOptionButtons()}
        </div>

        <div className={styles.footer}>
          <span>
            By signing in, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
