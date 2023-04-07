import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentProjectIdState,
  currentCueListState,
  gatewayConnectedState,
  currentTrackIdState,
} from "../../store/states";
import styles from "../../styles/components/Timetable.module.scss";
import { nanoid } from "nanoid";
import { Irisub } from "irisub-common";
import CueRow from "./CueRow";

type Props = {
  handleSeek: (value: number) => void;
};

const Timetable: React.FC<Props> = (props: Props) => {
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

  const [currentCueList, setCurrentCueList] = useRecoilState(currentCueListState);

  // useEffect(() => {
  //   if (eventList && eventList.length === 0) {
  //     if (currentTrackIndex === 0 || currentTrackIndex === null) {
  //       const introEvents = [
  //         "Welcome to Irisub! This is the first subtitle.",
  //         "To get started, click Select Video to choose a file or Youtube/Vimeo/etc. video.",
  //         "You can resize the panels on this page by clicking and dragging the dividers.",
  //         "Split text into multiple lines with Shift+Enter.\nThis is the second line.",
  //       ];

  //       setCurrentEventList(
  //         introEvents.map((text, index) => ({
  //           index: index,
  //           text: text,
  //           start_ms: index * 3000,
  //           end_ms: (index + 1) * 3000,
  //         }))
  //       );
  //     } else {
  //       addEvent();
  //     }
  //   }
  // }, [eventList]);

  const createNewCue = (text = "") => {
    let startMs = 0;
    let endMs = 3000;

    if (currentCueList.length > 0) {
      const lastCue = currentCueList[currentCueList.length - 1];
      startMs = lastCue.end_ms;
      endMs = startMs + 3000;
    }

    setCurrentCueList([
      ...currentCueList,
      {
        id: nanoid(),
        text: text,
        start_ms: startMs,
        end_ms: endMs,
      },
    ]);
  };

  const handleInputMoveFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let delta = 0;

    if (e.key === "ArrowUp") delta = -1;
    if (e.key === "ArrowDown" || e.key === "Enter") delta = 1;

    if (delta !== 0) {
      const inputId = e.currentTarget.id;
      const splitIdx = inputId.lastIndexOf("-");
      const cueIdx = parseInt(inputId.substring(splitIdx + 1, inputId.length));

      const newCueIdx = cueIdx + delta;
      const _move = () => {
        const newInputId = inputId.substring(0, splitIdx + 1) + newCueIdx;
        const newInput = document.getElementById(newInputId) as HTMLInputElement | null;
        if (newInput) {
          newInput.focus();
          e.preventDefault();

          const selectionPos = e.currentTarget ? e.currentTarget.selectionStart : 0;
          newInput.setSelectionRange(selectionPos, selectionPos);
        }
      };

      if (newCueIdx >= 0 && newCueIdx < currentCueList.length) {
        _move();
      } else if (newCueIdx >= currentCueList.length && e.key === "Enter") {
        createNewCue();
        setTimeout(() => _move(), 0);
      }
    }
  };

  const renderRows = () => {
    if (currentTrackId === null) return;

    const sortedCueList = currentCueList
      .slice()
      .sort((a: Irisub.Cue, b: Irisub.Cue) => a.start_ms - b.start_ms);

    // TODO: do sort as selector
    return sortedCueList.map((cue: Irisub.Cue, index: number) => {
      // TODO: avoid re-renders
      // https://alexsidorenko.com/blog/react-list-rerender/
      return (
        <CueRow
          key={cue.id}
          index={index}
          cue={cue}
          handleInputMoveFocus={handleInputMoveFocus}
          handleSeek={props.handleSeek}
        />
      );
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th />
            <th>#</th>
            <th style={{ whiteSpace: "nowrap" }}>Start</th>
            <th>End</th>
            <th title="Characters Per Second">CPS</th>
            <th>Style</th>
            <th>Actor</th>
            <th style={{ textAlign: "left", paddingLeft: "6px" }}>Text</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr className={styles.comment}>
            <td colSpan={99}>
              <span>something here</span>
            </td>
          </tr> */}
          {renderRows()}
          <tr className={styles.add} onClick={() => createNewCue()}>
            <td colSpan={8}>+++</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
