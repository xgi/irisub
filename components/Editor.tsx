import { useState } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { useRecoilValue } from "recoil";
import { playerProgressState } from "../store/player";
import styles from "../styles/components/Editor.module.scss";
import Player from "./Player";
import TextEditor from "./TextEditor";
import Timetable from "./timetable/Timetable";
import subsvtt from "../lib/subsvtt";

type Props = {};

const Something: React.FC<Props> = (props: Props) => {
  const playerProgress = useRecoilValue(playerProgressState);
  const [videoPath, setVideoPath] = useState<string | undefined>();

  const handleUploadVideo = (event: any) => {
    setVideoPath(URL.createObjectURL(event.target.files[0]));
  };

  const handleConnect = () => {
    const vid = document.getElementById("myvideo");

    if (vid) {
      const subobj = new Blob([subsvtt], { type: "text/vtt" });
      const url = (URL || webkitURL).createObjectURL(subobj);
      const track = document.createElement("track");
      console.log(subobj);
      track.kind = "captions";
      track.label = "English";
      track.srclang = "en";
      track.src = url;
      track.default = true;
      vid.appendChild(track);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controlBar}>
        <span>Control bar</span>
      </div>
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <ReflexContainer orientation="vertical">
            <ReflexElement>
              <div className={styles.pane}>
                <Player path={videoPath} />
              </div>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement>
              <ReflexContainer orientation="horizontal">
                <ReflexElement>
                  <div className={styles.pane}>
                    <p>video:</p>
                    <input type="file" onChange={handleUploadVideo} />
                    <button onClick={handleConnect}>connect</button>
                    <p>
                      progress:{" "}
                      {new Date(playerProgress * 1000)
                        .toISOString()
                        .substring(12, 23)}
                    </p>
                  </div>
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement>
                  <div className={styles.pane}>
                    <TextEditor />
                  </div>
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement>
          <div className={styles.pane} style={{ overflowY: "auto" }}>
            <Timetable />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default Something;
