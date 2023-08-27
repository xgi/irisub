import Modal from '../Modal';
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithCredential,
} from 'firebase/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconArrowLeft, IconEmail, IconGitHub, IconGoogle, IconMicrosoft, IconX } from '../Icons';
import { useState } from 'react';
import { loginModalOpenState } from '../../store/modals';
import { accentState } from '../../store/theme';
import Button from '../Button';

enum ProviderName {
  GOOGLE = 'GOOGLE',
  MICROSOFT = 'MICROSOFT',
  GITHUB = 'GITHUB',
}

type Props = unknown;

const LoginModal: React.FC<Props> = () => {
  const accent = useRecoilValue(accentState);
  const [loginModalOpen, setLoginModalOpen] = useRecoilState(loginModalOpenState);
  const [showingEmailForm, setShowingEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const close = (successful = true) => {
    setEmail('');
    setShowingEmailForm(false);
    setMagicLinkSent(false);

    setLoginModalOpen(false);
  };

  const getProvider = (providerName: ProviderName) => {
    switch (providerName) {
      case ProviderName.GOOGLE:
        return new GoogleAuthProvider();
      case ProviderName.MICROSOFT:
        return new OAuthProvider('microsoft.com');
      case ProviderName.GITHUB:
        return new GithubAuthProvider();
    }
  };

  const handleLogin = (providerName: ProviderName) => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    const provider = getProvider(providerName);

    linkWithPopup(auth.currentUser, provider)
      .then((loginResult) => {
        const currentUser = loginResult.user;
      })
      .catch((error) => {
        if (error.code === 'auth/credential-already-in-use') {
          // User had already been linked with a different account, so sign-in to it instead.
          // TODO: this means the current anon user is lost -- should prompt that they will
          // lose their current project, or migrate it here

          let credential = null;
          switch (providerName) {
            case ProviderName.GOOGLE:
              credential = GoogleAuthProvider.credentialFromError(error);
              break;
            case ProviderName.MICROSOFT:
              credential = OAuthProvider.credentialFromError(error);
              break;
            case ProviderName.GITHUB:
              credential = GithubAuthProvider.credentialFromError(error);
              break;
          }
          if (credential) signInWithCredential(getAuth(), credential);
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        close();
      });
  };

  const handleEmailPasswordless = () => {
    setLoading(true);

    const actionCodeSettings = {
      url: 'http://localhost:5173/finishSignUp?cartId=1234',
      handleCodeInApp: true,
    };

    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        setMagicLinkSent(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderOptionButtons = () => {
    return (
      <>
        <button
          className="w-full cursor-pointer text-sm font-semibold flex items-center text-left gap-4 text-slate-11 hover:text-slate-12 border border-slate-7 hover:border-slate-8 hover:bg-slate-4  mx-0 my-1 px-4 py-3"
          onClick={() => handleLogin(ProviderName.GOOGLE)}
        >
          <IconGoogle width={18} height={18} />
          <span>Continue with Google</span>
        </button>
        <button
          className="w-full cursor-pointer text-sm font-semibold flex items-center text-left gap-4 text-slate-11 hover:text-slate-12 border border-slate-7 hover:border-slate-8 hover:bg-slate-4  mx-0 my-1 px-4 py-3"
          onClick={() => handleLogin(ProviderName.MICROSOFT)}
        >
          <IconMicrosoft width={18} height={18} />
          <span>Continue with Microsoft</span>
        </button>
        <button
          className="w-full cursor-pointer text-sm font-semibold flex items-center text-left gap-4 text-slate-11 hover:text-slate-12 border border-slate-7 hover:border-slate-8 hover:bg-slate-4  mx-0 my-1 px-4 py-3"
          onClick={() => handleLogin(ProviderName.GITHUB)}
        >
          <IconGitHub width={18} height={18} />
          <span>Continue with GitHub</span>
        </button>
        <button
          className="w-full cursor-pointer text-sm font-semibold flex items-center text-left gap-4 text-slate-11 hover:text-slate-12 border border-slate-7 hover:border-slate-8 hover:bg-slate-4  mx-0 my-1 px-4 py-3"
          onClick={() => setShowingEmailForm(true)}
        >
          <IconEmail width={18} height={18} />
          <span>Continue with email</span>
        </button>
      </>
    );
  };

  const renderEmailForm = () => {
    if (magicLinkSent) {
      return (
        <div className="py-0 px-4 text-slate-12">
          <h2 className="flex items-center justify-center text-xl mb-2 font-bold">Email sent!</h2>
          <p className="text-slate-12 text-base">
            We sent a verification email to{' '}
            <span className={`text-${accent}-500 font-semibold`}>{email}</span>. Please check your
            inbox and click the link to finish signing in.
          </p>
        </div>
      );
    }

    return (
      <>
        <input
          className="w-full px-2 py-1.5 inline bg-slate-3 text-slate-12 rounded-sm outline-none border border-slate-7 focus:border-slate-8"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEmailPasswordless();
          }}
          autoFocus
        />
        <div className="w-full flex gap-2 mt-2">
          <a
            className="flex flex-1 items-center text-left cursor-pointer text-slate-11 hover:text-slate-12"
            onClick={() => setShowingEmailForm(false)}
          >
            <IconArrowLeft />
            All login options
          </a>
          <Button accent onClick={handleEmailPasswordless}>
            Send sign-in link
          </Button>
        </div>
      </>
    );
  };

  const renderLoader = () => {
    return (
      <div>
        <div className="w-6 h-6 border-4 rounded-full border-slate-11 border-b-transparent inline-block box-border animate-spin" />
      </div>
    );
  };

  return (
    <Modal isOpen={loginModalOpen} handleClose={() => close(false)}>
      <div className="w-full text-center">
        <div className="bg-slate-2 border-b border-slate-6 px-5 py-3 flex items-center justify-between">
          <h3 className="text-slate-12 text-lg m-0 font-bold">Login to Irisub</h3>
          <button className="text-slate-11 hover:text-slate-12 bg-transparent h-6 w-6 border-none cursor-pointer">
            <IconX width={22} height={22} onClick={() => close(false)} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mx-4 my-1 px-2 py-3">
          {loading ? renderLoader() : showingEmailForm ? renderEmailForm() : renderOptionButtons()}
        </div>

        <div className="text-slate-11 bg-slate-2 px-4 py-2 font-medium text-xs border-t border-slate-6">
          By signing in, you agree to our{' '}
          <a className={`cursor-pointer text-${accent}-500 hover:text-${accent}-600`} href="#">
            Terms of Service
          </a>{' '}
          and{' '}
          <a className={`cursor-pointer text-${accent}-500 hover:text-${accent}-600`} href="#">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
