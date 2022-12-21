import "./styles/global/colors.scss";
import "./styles/global/general.scss";
import "./styles/global/reflex.scss";
import "./styles/global/player.scss";
import "./styles/global/tooltip.scss";
import { RecoilRoot } from "recoil";
import Base from "./components/Base";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDhxbmwAD0wSYYRdZhwNkXHetytT-T0VBU",
  authDomain: "irisub.firebaseapp.com",
  databaseURL: "https://irisub-default-rtdb.firebaseio.com",
  projectId: "irisub",
  storageBucket: "irisub.appspot.com",
  messagingSenderId: "42922342456",
  appId: "1:42922342456:web:e8d7467de3955c6bb40ecd",
};

const app = initializeApp(firebaseConfig);

function App() {
  return (
    <RecoilRoot>
      <Base />
    </RecoilRoot>
  );
}

export default App;
