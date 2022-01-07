import { KeyboardEvent, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
// import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { useRecoilState, useRecoilValue } from "recoil";
import { currentEventIndexState, currentEventListState } from "../store/states";

type Props = {};
const TextEditor: React.FC<Props> = (props: Props) => {
  const [currentEventIndex, setCurrentEventIndex] = useRecoilState(
    currentEventIndexState
  );
  const [currentEventList, setCurrentEventList] = useRecoilState(
    currentEventListState
  );

  const setCurrentData = (text: string) => {
    if (currentEventIndex && currentEventList) {
      const _temp = [...currentEventList];
      _temp[currentEventIndex] = { ..._temp[currentEventIndex], text: text };
      setCurrentEventList(_temp);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // TODO: set current event to the next event in the list
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Editor
      placeholder="Edit text..."
      value={
        currentEventIndex && currentEventList
          ? currentEventList[currentEventIndex].text
          : ""
      }
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
