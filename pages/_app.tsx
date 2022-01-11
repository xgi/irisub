import "../styles/global/general.css";
import "../styles/global/colors.css";
import "../styles/global/reflex.css";
import "../styles/global/player.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
