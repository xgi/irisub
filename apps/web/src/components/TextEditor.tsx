import { KeyboardEvent } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // TODO: update style
import { useRecoilState } from "recoil";
import { editingEventIndexState } from "../store/states";
import { currentEventListState } from "../store/events";

type Props = {};
const TextEditor: React.FC<Props> = (props: Props) => {
  const [editingEventIndex, setEditingEventIndex] = useRecoilState(editingEventIndexState);
  const [currentEventList, setCurrentEventList] = useRecoilState(currentEventListState);

  const setCurrentData = (text: string) => {
    if (currentEventList[editingEventIndex]) {
      const _temp = [...currentEventList];
      _temp[editingEventIndex] = { ..._temp[editingEventIndex], text: text };
      setCurrentEventList(_temp);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      setEditingEventIndex(editingEventIndex + 1);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Editor
      placeholder="Edit text..."
      value={currentEventList[editingEventIndex] ? currentEventList[editingEventIndex].text : ""}
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
