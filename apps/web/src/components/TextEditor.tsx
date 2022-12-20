import { KeyboardEvent } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // TODO: update style
import { useRecoilState } from "recoil";
import { currentEventIndexState, currentTrackState } from "../store/states";

type Props = {};
const TextEditor: React.FC<Props> = (props: Props) => {
  const [currentEventIndex, setCurrentEventIndex] = useRecoilState(currentEventIndexState);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);

  const setCurrentData = (text: string) => {
    if (currentTrack && currentTrack.events[currentEventIndex]) {
      const _temp = [...currentTrack.events];
      _temp[currentEventIndex] = { ..._temp[currentEventIndex], text: text };
      setCurrentTrack({ ...currentTrack, events: _temp });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      setCurrentEventIndex(currentEventIndex + 1);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Editor
      placeholder="Edit text..."
      value={
        currentTrack && currentTrack.events[currentEventIndex]
          ? currentTrack.events[currentEventIndex].text
          : ""
      }
      onValueChange={(value: string) => setCurrentData(value)}
      highlight={(value: string) => Prism.highlight(value || "", Prism.languages.html, "html")}
      onKeyDownCapture={handleKeyDown}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
      }}
    />
  );
};

export default TextEditor;
