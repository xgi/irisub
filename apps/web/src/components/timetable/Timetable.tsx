import React from "react";
import { useRecoilState } from "recoil";
import {
  currentEventIndexState,
  currentEventListState,
  currentTrackState,
} from "../../store/states";
import styles from "../../styles/components/Timetable.module.scss";
import { classNames } from "../../util/layout";
import TimeInput from "../TimeInput";
import { useFocusNext } from "./hooks";
import { Irisub } from "irisub-common";

type Props = {};

const Timetable: React.FC<Props> = (props: Props) => {
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [currentEventList, setCurrentEventList] = useRecoilState(currentEventListState);
  const [currentEventIndex, setCurrentEventIndex] = useRecoilState(currentEventIndexState);
  const textFocusNextRef = useFocusNext(setCurrentEventIndex);
  const startTimeFocusNextRef = useFocusNext(setCurrentEventIndex, true);
  const endTimeFocusNextRef = useFocusNext(setCurrentEventIndex, true);

  const handleRowClick = (index: number) => {
    setCurrentEventIndex(index);
  };

  const addEvent = () => {
    setCurrentEventList([
      ...currentEventList,
      { index: currentEventList.length, text: "", start_ms: 3000, end_ms: 5000 },
    ]);
  };

  const updateEvent = (
    index: number,
    data: { text?: string; start_ms?: number; end_ms?: number }
  ) => {
    const newEvent: Irisub.Event = { ...currentEventList[index] };
    if (data.text !== undefined) newEvent.text = data.text;
    if (data.start_ms !== undefined) newEvent.start_ms = data.start_ms;
    if (data.end_ms !== undefined) newEvent.end_ms = data.end_ms;

    const _temp = [...currentEventList];
    _temp[index] = newEvent;
    setCurrentEventList(_temp);
  };

  const renderRows = () => {
    if (currentTrack === null) return;

    return currentEventList
      .slice()
      .sort((a, b) => a.index - b.index)
      .map((event) => {
        // TODO: avoid re-renders
        // https://alexsidorenko.com/blog/react-list-rerender/
        return (
          <tr
            key={event.index}
            className={classNames(currentEventIndex === event.index ? styles.active : "")}
            onClick={() => handleRowClick(event.index)}
            tabIndex={event.index + 1}
          >
            <td>{event.index + 1}</td>
            <td></td>
            <td>
              <TimeInput
                inputRef={startTimeFocusNextRef}
                className={styles.input}
                data-index={event.index}
                style={{ minWidth: "8em", textAlign: "center" }}
                valueMs={event.start_ms}
                callback={(value: number) => updateEvent(event.index, { start_ms: value })}
              />
            </td>
            <td>
              <TimeInput
                inputRef={endTimeFocusNextRef}
                className={styles.input}
                data-index={event.index}
                style={{ minWidth: "8em", textAlign: "center" }}
                valueMs={event.end_ms}
                callback={(value: number) => updateEvent(event.index, { end_ms: value })}
              />
            </td>
            <td>23</td>
            <td>Default</td>
            <td>Steve</td>
            <td style={{ width: "100%" }}>
              <input
                ref={textFocusNextRef}
                className={styles.input}
                data-index={event.index}
                placeholder=""
                value={event.text.replaceAll("\n", "␤")}
                onChange={(changeEvent: any) =>
                  updateEvent(event.index, {
                    text: changeEvent.target.value,
                  })
                }
              />
            </td>
          </tr>
        );
      });
  };

  if (currentTrack === null) return <span>track is null</span>;

  return (
    <div style={{ width: "100%" }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>L</th>
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
          <tr className={styles.add} onClick={() => addEvent()}>
            <td colSpan={8}>+++</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
