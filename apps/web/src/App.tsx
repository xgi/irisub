import "./styles/global/colors.scss";
import "./styles/global/general.scss";
import "./styles/global/reflex.scss";
import "./styles/global/player.scss";
import "./styles/global/tooltip.scss";
import { RecoilRoot } from "recoil";
import Base from "./components/Base";

function App() {
  return (
    <RecoilRoot>
      <Base />
    </RecoilRoot>
  );
}

export default App;
