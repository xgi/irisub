import { useState } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { useRecoilValue } from "recoil";
import { playerProgressState } from "../store/player";
import styles from "../styles/components/Something.module.scss";
import Player from "./Player";
import SubtitleOverlay from "./SubtitleOverlay";

type Props = {};

const Something: React.FC<Props> = (props: Props) => {
  const playerProgress = useRecoilValue(playerProgressState);
  const [videoPath, setVideoPath] = useState<string | undefined>();

  const handleUpload = (event: any) => {
    setVideoPath(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className={styles.container}>
      <ReflexContainer orientation="vertical">
        <ReflexElement className="left-pane">
          <div className={styles.pane}>
            <p>select file:</p>
            <input type="file" onChange={handleUpload} />
          </div>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement>
          <ReflexContainer orientation="horizontal">
            <ReflexElement>
              <div className={styles.pane} style={{ overflow: "hidden" }}>
                <SubtitleOverlay />
                <Player path={videoPath} />
              </div>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement>
              <div className={styles.pane}>
                <p>
                  progress:{" "}
                  {new Date(playerProgress * 1000)
                    .toISOString()
                    .substring(12, 23)}
                </p>
              </div>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default Something;
