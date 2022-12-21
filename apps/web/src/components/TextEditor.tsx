import { KeyboardEvent } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // TODO: update style
import { useRecoilState } from "recoil";
import { currentEventIndexState, currentEventListState } from "../store/states";

type Props = {};
const TextEditor: React.FC<Props> = (props: Props) => {
  const [currentEventIndex, setCurrentEventIndex] = useRecoilState(currentEventIndexState);
  const [currentEventList, setCurrentEventList] = useRecoilState(currentEventListState);

  const setCurrentData = (text: string) => {
    if (currentEventList[currentEventIndex]) {
      const _temp = [...currentEventList];
      _temp[currentEventIndex] = { ..._temp[currentEventIndex], text: text };
      setCurrentEventList(_temp);
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
      value={currentEventList[currentEventIndex] ? currentEventList[currentEventIndex].text : ""}
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
