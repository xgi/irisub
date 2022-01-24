import React from "react";
import { useRecoilState } from "recoil";
import {
  currentEventIndexState,
  currentEventListState,
} from "../../store/states";
import styles from "../../styles/components/Timetable.module.scss";
import { MAX_TIMESTAMP_MS } from "../../util/constants";
import { classNames } from "../../util/layout";
import { useFocusNext } from "./hooks";

type Props = {};

const Timetable: React.FC<Props> = (props: Props) => {
  const [currentEventList, setCurrentEventList] = useRecoilState(
    currentEventListState
  );
  const [currentEventIndex, setCurrentEventIndex] = useRecoilState(
    currentEventIndexState
  );
  const textFocusNextRef = useFocusNext(setCurrentEventIndex);
  const endFocusNextRef = useFocusNext(setCurrentEventIndex, true);

  const handleRowClick = (index: number) => {
    setCurrentEventIndex(index);
  };

  const handleChangeText = (index: number, text: string) => {
    const _temp = [...currentEventList];
    _temp[index] = { ..._temp[index], text: text };
    setCurrentEventList(_temp);
  };

  const handleChangeEndTime = (
    index: number,
    keyboardEvent: React.KeyboardEvent
  ) => {
    if (!/[0-9]/.test(keyboardEvent.key)) {
      keyboardEvent.preventDefault();
      return;
    }
    const digit = parseInt(keyboardEvent.key);

    const prevEvent = currentEventList[index];
    let ms = Math.floor(prevEvent.end_ms % 1000);
    let seconds = Math.floor((prevEvent.end_ms / 1000) % 60);
    let minutes = Math.floor((prevEvent.end_ms / (1000 * 60)) % 60);
    let hours = Math.floor((prevEvent.end_ms / (1000 * 60 * 60)) % 60);

    const target = keyboardEvent.target as HTMLInputElement;
    const pointer = target.selectionStart || 0;

    let nextPointer = pointer + 1;
    switch (pointer) {
      case 0:
        nextPointer++;
      case 1:
        hours = digit;
        break;
      case 2:
        minutes = Math.floor(minutes % 10) + digit * 10;
        break;
      case 3:
        nextPointer++;
      case 4:
        minutes = Math.floor(minutes / 10) * 10 + digit;
        break;
      case 5:
        seconds = Math.floor(seconds % 10) + digit * 10;
        break;
      case 6:
        nextPointer++;
      case 7:
        seconds = Math.floor(seconds / 10) * 10 + digit;
        break;
      case 8:
        ms = Math.floor(ms % 100) + digit * 100;
        break;
      case 9:
        ms = Math.floor(ms / 100) * 100 + digit * 10 + Math.floor(ms % 10);
        break;
      case 11:
        nextPointer = pointer;
      case 10:
        ms = Math.floor(ms / 10) * 10 + digit;
    }

    let newValue = Math.floor(
      ms + seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000
    );
    if (newValue > MAX_TIMESTAMP_MS) {
      newValue = MAX_TIMESTAMP_MS;
    }

    const _temp = [...currentEventList];
    _temp[index] = { ..._temp[index], end_ms: newValue };
    setCurrentEventList(_temp);

    window.requestAnimationFrame(() => {
      target.setSelectionRange(nextPointer, nextPointer);
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>L</th>
            <th style={{ whiteSpace: "nowrap" }}>Start</th>
            <th>End</th>
            <th>CPS</th>
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
          {currentEventList.map((event) => {
            // TODO: avoid re-renders
            // https://alexsidorenko.com/blog/react-list-rerender/
            return (
              <tr
                key={event.id}
                className={classNames(
                  currentEventIndex === event.index ? styles.active : ""
                )}
                onClick={() => handleRowClick(event.index)}
                tabIndex={event.index + 1}
              >
                <td>{event.index + 1}</td>
                <td></td>
                <td>00:00:00.000</td>
                <td>
                  <input
                    ref={endFocusNextRef}
                    className={styles.input}
                    data-index={event.index}
                    style={{ minWidth: "8em", textAlign: "center" }}
                    value={new Date(event.end_ms)
                      .toISOString()
                      .substring(12, 23)}
                    onKeyPress={(keyboardEvent) =>
                      handleChangeEndTime(event.index, keyboardEvent)
                    }
                    onChange={() => true}
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
                    value={event.text.replaceAll("\n", "|")}
                    onChange={(changeEvent: any) =>
                      handleChangeText(event.index, changeEvent.target.value)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
