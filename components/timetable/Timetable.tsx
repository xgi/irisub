import React from "react";
import { useRecoilState } from "recoil";
import {
  currentEventIndexState,
  currentEventListState,
} from "../../store/states";
import styles from "../../styles/components/Timetable.module.scss";
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
  const focusNextRef = useFocusNext(setCurrentEventIndex);

  const handleRowClick = (index: number) => {
    setCurrentEventIndex(index);
  };

  const handleChangeText = (index: number, text: string) => {
    const _temp = [...currentEventList];
    _temp[index] = { ..._temp[index], text: text };
    setCurrentEventList(_temp);
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
          {currentEventList.map((event, idx) => {
            // TODO: avoid re-renders
            // https://alexsidorenko.com/blog/react-list-rerender/
            return (
              <tr
                key={event.id}
                className={classNames(
                  currentEventIndex === idx ? styles.active : ""
                )}
                onClick={() => handleRowClick(idx)}
                tabIndex={idx + 1}
              >
                <td>{idx + 1}</td>
                <td></td>
                <td>00:00:00.000</td>
                <td>
                  <input
                    className={styles.input}
                    style={{ minWidth: "8em", textAlign: "center" }}
                    placeholder="00:00:02.000"
                  />
                </td>
                <td>23</td>
                <td>Default</td>
                <td>Steve</td>
                <td style={{ width: "100%" }}>
                  <input
                    ref={focusNextRef}
                    className={styles.input}
                    data-index={idx}
                    placeholder=""
                    value={event.text.replaceAll("\n", "|")}
                    onChange={(changeEvent: any) =>
                      handleChangeText(idx, changeEvent.target.value)
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
