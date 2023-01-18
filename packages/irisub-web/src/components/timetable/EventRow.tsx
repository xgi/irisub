import { gql, useMutation } from "@apollo/client";
import { Irisub } from "irisub-common";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UPDATE_EVENT } from "../../constants/graphql";
import { editingEventIndexState, editingEventState } from "../../store/states";
import styles from "../../styles/components/EventTextInput.module.scss";
import { useDebouncedValue } from "../../util/hooks";
import { classNames } from "../../util/layout";
import TimeInput from "../TimeInput";
import EventTextInput from "./EventTextInput";

type Props = {
  event: Irisub.Event;
};

const EventRow: React.FC<Props> = (props: Props) => {
  const [tempUpdateEvent, { data, loading, error }] = useMutation(UPDATE_EVENT);
  const [editingEventIndex, setEditingEventIndex] = useRecoilState(editingEventIndexState);
  const [editingEvent, setEditingEvent] = useRecoilState(editingEventState);
  const [value, setValue] = useState(props.event);
  const [debounced] = useDebouncedValue(value, 1000);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) setEditingEvent({ ...props.event, ...value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, value]);

  useEffect(() => {
    if (debounced !== props.event) {
      const newEvent = { ...debounced };
      if ("__typename" in newEvent) delete newEvent.__typename;
      tempUpdateEvent({ variables: { event_id: props.event.id, event: newEvent } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    if (!editing) setValue(props.event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.event]);

  return (
    <tr
      key={props.event.index}
      className={classNames(editingEventIndex === props.event.index ? styles.editing : "")}
      onClick={() => setEditingEventIndex(props.event.index)}
    >
      {/* {renderRowStatusCell(props.event)} */}
      <td>S</td>
      <td style={{ textAlign: "right" }}>{props.event.index + 1}</td>
      <td style={{ paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
        <TimeInput
          id={`timetable-input-starttime-${props.event.index}`}
          className={styles.input}
          tabIndex={props.event.index + 1}
          data-index={props.event.index}
          style={{ minWidth: "8em", textAlign: "center" }}
          valueMs={value.start_ms}
          callback={(newStartMs: number) => setValue({ ...value, start_ms: newStartMs })}
          onFocus={() => setEditingEventIndex(props.event.index)}
          // onKeyDown={handleInputMoveFocus}
          hasButtons
        />
      </td>
      <td style={{ paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
        <TimeInput
          id={`timetable-input-endtime-${props.event.index}`}
          className={styles.input}
          tabIndex={props.event.index + 1}
          data-index={props.event.index}
          style={{ minWidth: "8em", textAlign: "center" }}
          valueMs={value.end_ms}
          callback={(newEndMs: number) => setValue({ ...value, end_ms: newEndMs })}
          onFocus={() => setEditingEventIndex(props.event.index)}
          // onKeyDown={handleInputMoveFocus}
          hasButtons
        />
      </td>
      <td>3</td>
      {/* <td>{getCPS(event)}</td> */}
      <td>Default</td>
      <td>Steve</td>
      <td style={{ width: "100%" }}>
        <EventTextInput
          event={props.event}
          callback={(newText: string) => setValue({ ...value, text: newText })}
        />
      </td>
    </tr>
  );
};

export default EventRow;
