import { Irisub } from "irisub-common";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentCueListState, editingCueIdState, editingCueState } from "../../store/states";
import styles from "../../styles/components/CueTextInput.module.scss";
import { useDebouncedValue } from "../../util/hooks";
import { classNames } from "../../util/layout";
import TimeInput from "../TimeInput";
import CueTextInput from "./CueTextInput";
import CueStatusCell from "./CueStatusCell";
import { shallowEqual } from "../../util/comparison";

type Props = {
  index: number;
  cue: Irisub.Cue;
  handleInputMoveFocus: (e: React.KeyboardEvent<HTMLInputElement>, isKeyUp?: boolean) => void;
  handleSeek: (value: number) => void;
};

const CueRow: React.FC<Props> = (props: Props) => {
  const [currentCueList, setCurrentCueList] = useRecoilState(currentCueListState);
  const [editingCueId, setEditingCueId] = useRecoilState(editingCueIdState);
  const [editingCue, setEditingCue] = useRecoilState(editingCueState);
  const [value, setValue] = useState(props.cue);
  const [debounced] = useDebouncedValue(value, 500);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) setEditingCue({ ...props.cue, ...value });
  }, [editing, value]);

  useEffect(() => {
    if (debounced !== props.cue) {
      const newCueList = [...currentCueList];
      const indexToModify = newCueList.findIndex((cue) => cue.id === debounced.id);

      if (indexToModify !== -1) {
        if (!shallowEqual(newCueList[indexToModify], debounced)) {
          newCueList[indexToModify] = { ...debounced };
          setCurrentCueList(newCueList);
        }
      } else {
        console.error(
          `Attempted to modify cue, but could not find existing with ID: ${debounced.id}`,
        );
      }
    }
  }, [debounced]);

  useEffect(() => {
    if (!editing) setValue(props.cue);
  }, [props.cue]);

  const getCPS = (cue: Irisub.Cue) => {
    const cps = Math.ceil(cue.text.length / ((cue.end_ms - cue.start_ms) / 1000));
    if (cps === Infinity || Number.isNaN(cps)) return 0;
    return cps;
  };

  return (
    <tr
      key={props.cue.id}
      className={classNames(editingCueId === props.cue.id ? styles.editing : "")}
      onClick={() => setEditingCueId(props.cue.id)}
    >
      <CueStatusCell cue={props.cue} handleSeek={props.handleSeek} />
      <td style={{ textAlign: "right" }}>{props.index + 1}</td>
      <td style={{ paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
        <TimeInput
          id={`timetable-input-starttime-${props.cue.id}`}
          className={styles.input}
          tabIndex={props.index + 1}
          data-index={props.index}
          style={{ minWidth: "8em", textAlign: "center" }}
          valueMs={value.start_ms}
          callback={(newStartMs: number) => {
            const newEndMs = value.end_ms < newStartMs ? newStartMs : value.end_ms;
            setValue({ ...value, start_ms: newStartMs, end_ms: newEndMs });
          }}
          onFocus={() => setEditingCueId(props.cue.id)}
          // onKeyDown={handleInputMoveFocus}
          hasButtons
        />
      </td>
      <td style={{ paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
        <TimeInput
          id={`timetable-input-endtime-${props.cue.id}`}
          className={styles.input}
          tabIndex={props.index + 1}
          data-index={props.index}
          style={{ minWidth: "8em", textAlign: "center" }}
          valueMs={value.end_ms}
          callback={(newEndMs: number) => {
            const newStartMs = value.start_ms > newEndMs ? newEndMs : value.start_ms;
            setValue({ ...value, end_ms: newEndMs, start_ms: newStartMs });
          }}
          onFocus={() => setEditingCueId(props.cue.id)}
          // onKeyDown={handleInputMoveFocus}
          hasButtons
        />
      </td>
      <td>{getCPS(editingCueId === props.cue.id && editingCue ? editingCue : value)}</td>
      <td>Default</td>
      <td>Steve</td>
      <td style={{ width: "100%" }}>
        <CueTextInput
          index={props.index}
          cue={props.cue}
          callback={(newText: string) => setValue({ ...value, text: newText })}
          handleInputMoveFocus={props.handleInputMoveFocus}
        />
      </td>
    </tr>
  );
};

export default CueRow;
