import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import { initializeFirebase } from './services/firebase';
import AuthRoot from './components/auth/AuthRoot';
import GatewayRoot from './components/gateway/GatewayRoot';

initializeFirebase();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <AuthRoot>
      <GatewayRoot>
        <App />
      </GatewayRoot>
    </AuthRoot>
  </RecoilRoot>
);
