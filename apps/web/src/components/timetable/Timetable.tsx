import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  editingEventIndexState,
  currentTrackState,
  currentProjectIdState,
} from "../../store/states";
import styles from "../../styles/components/Timetable.module.scss";
import { classNames } from "../../util/layout";
import TimeInput from "../TimeInput";
import { useFocusNext } from "./hooks";
import { Irisub } from "irisub-common";
import { currentEventListState } from "../../store/events";

type Props = {};

const Timetable: React.FC<Props> = (props: Props) => {
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [currentEventList, setCurrentEventList] = useRecoilState(currentEventListState);
  const resetCurrentEventList = useResetRecoilState(currentEventListState);
  const [editingEventIndex, setEditingEventIndex] = useRecoilState(editingEventIndexState);
  const textFocusNextRef = useFocusNext();
  const startTimeFocusNextRef = useFocusNext(true);
  const endTimeFocusNextRef = useFocusNext(true);

  const addEvent = () => {
    setCurrentEventList([
      ...currentEventList,
      { index: currentEventList.length, text: "", start_ms: 3000, end_ms: 5000 },
    ]);
  };

  useEffect(() => {
    console.log("currentProjectId changed, resetting event list");
    resetCurrentEventList();
  }, [currentProjectId]);

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

    const _eventList = currentEventList.slice().sort((a, b) => a.index - b.index);
    // _eventList[_eventList.length] = {
    //   index: _eventList.length,
    //   text: "",
    //   start_ms: 0,
    //   end_ms: 0,
    // };

    return _eventList.map((event) => {
      // TODO: avoid re-renders
      // https://alexsidorenko.com/blog/react-list-rerender/
      return (
        <tr
          key={event.index}
          className={classNames(editingEventIndex === event.index ? styles.editing : "")}
          onClick={() => setEditingEventIndex(event.index)}
        >
          <td style={{ textAlign: "right" }}>{event.index + 1}</td>
          <td></td>
          <td>
            <TimeInput
              inputRef={startTimeFocusNextRef}
              className={styles.input}
              tabIndex={event.index + 1}
              data-index={event.index}
              style={{ minWidth: "8em", textAlign: "center" }}
              valueMs={event.start_ms}
              callback={(value: number) => updateEvent(event.index, { start_ms: value })}
              onFocus={() => setEditingEventIndex(event.index)}
            />
          </td>
          <td>
            <TimeInput
              inputRef={endTimeFocusNextRef}
              className={styles.input}
              tabIndex={event.index + 1}
              data-index={event.index}
              style={{ minWidth: "8em", textAlign: "center" }}
              valueMs={event.end_ms}
              callback={(value: number) => updateEvent(event.index, { end_ms: value })}
              onFocus={() => setEditingEventIndex(event.index)}
            />
          </td>
          <td>23</td>
          <td>Default</td>
          <td>Steve</td>
          <td style={{ width: "100%" }}>
            <input
              ref={textFocusNextRef}
              className={styles.input}
              tabIndex={event.index + 1}
              data-index={event.index}
              placeholder=""
              value={event.text.replaceAll("\n", "␤")}
              onChange={(changeEvent: any) =>
                updateEvent(event.index, {
                  text: changeEvent.target.value,
                })
              }
              onFocus={() => setEditingEventIndex(event.index)}
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
          <React.Suspense fallback={<div>Loading...</div>}>{renderRows()}</React.Suspense>
          <tr className={styles.add} onClick={() => addEvent()}>
            <td colSpan={8}>+++</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
