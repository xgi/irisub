import { useRecoilState } from "recoil";
import {
  timetableActiveRowState,
  timetableDataState,
} from "../../store/player";
import styles from "../../styles/components/Timetable.module.scss";
import { classNames } from "../../util/layout";
import { useFocusNext } from "./hooks";

type Props = {};

const Timetable: React.FC<Props> = (props: Props) => {
  const [timetableActiveRow, setTimetableActiveRow] = useRecoilState(
    timetableActiveRowState
  );
  const [timetableData, setTimetableData] = useRecoilState(timetableDataState);
  const focusNextRef = useFocusNext(setTimetableActiveRow);

  const handleRowClick = (index: number) => {
    console.log(`clicked row ${index}`);
    setTimetableActiveRow(index);
  };

  const handleChangeText = (index: number, text: string) => {
    const _temp: string[] = Object.assign([], timetableData);
    _temp[index] = text;
    setTimetableData(_temp);
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
          <tr className={styles.comment}>
            <td colSpan={99}>
              <span>something here</span>
            </td>
          </tr>
          {Array(32)
            .fill(null)
            .map((_, i: number) => {
              // TODO: avoid re-renders
              // https://alexsidorenko.com/blog/react-list-rerender/
              return (
                <tr
                  key={i}
                  className={classNames(
                    timetableActiveRow === i ? styles.active : ""
                  )}
                  onClick={() => handleRowClick(i)}
                  tabIndex={i + 1}
                >
                  <td>{i}</td>
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
                      data-row-number={i}
                      placeholder=""
                      value={
                        timetableData[i]
                          ? timetableData[i].replaceAll("\n", "|")
                          : ""
                      }
                      onChange={(event: any) =>
                        handleChangeText(i, event.target.value)
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
