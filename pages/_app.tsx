import "../styles/global/general.scss";
import "../styles/global/colors.scss";
import "../styles/global/reflex.scss";
import "../styles/global/player.scss";
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
