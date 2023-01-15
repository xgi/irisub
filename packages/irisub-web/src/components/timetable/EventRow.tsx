import { gql, useMutation } from "@apollo/client";
import { Irisub } from "irisub-common";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { editingEventIndexState, editingEventState } from "../../store/states";
import styles from "../../styles/components/EventTextInput.module.scss";
import { useDebouncedValue } from "../../util/hooks";

const UPDATE_EVENT = gql`
  mutation updateEvent($event_id: uuid!, $text: String!) {
    update_events_by_pk(pk_columns: { id: $event_id }, _set: { text: $text }) {
      id
    }
  }
`;

type Props = {
  event: Irisub.Event;
};

const EventTextInput: React.FC<Props> = (props: Props) => {
  const [tempUpdateEvent, { data, loading, error }] = useMutation(UPDATE_EVENT);
  const [editingEventIndex, setEditingEventIndex] = useRecoilState(editingEventIndexState);
  const [editingEvent, setEditingEvent] = useRecoilState(editingEventState);
  const [value, setValue] = useState(props.event.text);
  const [debounced] = useDebouncedValue(value, 1000);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) setEditingEvent({ ...props.event, text: value });
  }, [editing, value]);

  useEffect(() => {
    tempUpdateEvent({ variables: { event_id: props.event.id, text: debounced } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    if (!editing) setValue(props.event.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.event.text]);

  return (
    <tr
      key={event.index}
      className={classNames(editingEventIndex === event.index ? styles.editing : "")}
      onClick={() => setEditingEventIndex(event.index)}
    >
      {renderRowStatusCell(event)}
      <td style={{ textAlign: "right" }}>{event.index + 1}</td>
      <td style={{ paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
        <TimeInput
          id={`timetable-input-starttime-${event.index}`}
          className={styles.input}
          tabIndex={event.index + 1}
          data-index={event.index}
          style={{ minWidth: "8em", textAlign: "center" }}
          valueMs={event.start_ms}
          callback={(value: number) => updateEvent(event.index, { start_ms: value })}
          onFocus={() => setEditingEventIndex(event.index)}
          onKeyDown={handleInputMoveFocus}
          hasButtons
        />
      </td>
      <td style={{ paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
        <TimeInput
          id={`timetable-input-endtime-${event.index}`}
          className={styles.input}
          tabIndex={event.index + 1}
          data-index={event.index}
          style={{ minWidth: "8em", textAlign: "center" }}
          valueMs={event.end_ms}
          callback={(value: number) => updateEvent(event.index, { end_ms: value })}
          onFocus={() => setEditingEventIndex(event.index)}
          onKeyDown={handleInputMoveFocus}
          hasButtons
        />
      </td>
      <td>{getCPS(event)}</td>
      <td>Default</td>
      <td>Steve</td>
      <td style={{ width: "100%" }}>
        <EventTextInput event={event} />
        {/* <input
              id={`timetable-input-text-${event.index}`}
              className={styles.input}
              tabIndex={event.index + 1}
              placeholder=""
              value={event.text.replaceAll("\n", "␤")}
              onChange={(changeEvent: any) =>
                updateEvent(event.index, {
                  text: changeEvent.target.value.replaceAll("␤", "\n"),
                })
              }
              onKeyDown={(e) => handleTextInputKeyDown(e, event)}
              onFocus={() => setEditingEventIndex(event.index)}
            /> */}
      </td>
    </tr>
  );
};

export default EventTextInput;
