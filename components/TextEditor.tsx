import { KeyboardEvent, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
// import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { useRecoilState, useRecoilValue } from "recoil";
import { timetableActiveRowState, timetableDataState } from "../store/player";

type Props = {};
const TextEditor: React.FC<Props> = (props: Props) => {
  const [timetableData, setTimetableData] = useRecoilState(timetableDataState);
  const [timetableActiveRow, setTimetableActiveRow] = useRecoilState(
    timetableActiveRowState
  );

  const setCurrentData = (text: string) => {
    const _temp: string[] = Object.assign([], timetableData);
    _temp[timetableActiveRow] = text;
    setTimetableData(_temp);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      setTimetableActiveRow(timetableActiveRow + 1);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Editor
      placeholder="Edit text..."
      value={timetableData[timetableActiveRow] || ""}
      onValueChange={(value: string) => setCurrentData(value)}
      highlight={(value: string) =>
        Prism.highlight(value || "", Prism.languages.html, "html")
      }
      onKeyDownCapture={handleKeyDown}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        // fontSize: 12,
      }}
    />
  );
};

export default TextEditor;
