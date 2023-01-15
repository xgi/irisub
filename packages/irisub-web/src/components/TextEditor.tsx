import { KeyboardEvent } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // TODO: update style
import { useRecoilState } from "recoil";
import { editingEventIndexState, editingEventState } from "../store/states";

type Props = {};
const TextEditor: React.FC<Props> = (props: Props) => {
  const [editingEventIndex, setEditingEventIndex] = useRecoilState(editingEventIndexState);
  const [editingEvent, setEditingEvent] = useRecoilState(editingEventState);

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
      value={editingEvent ? editingEvent.text : ""}
      onValueChange={(value: string) => {
        // setCurrentData(value);
      }}
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
