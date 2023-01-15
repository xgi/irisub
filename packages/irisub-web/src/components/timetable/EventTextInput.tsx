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

  // const updateEvent = (
  //   index: number,
  //   data: { text?: string; start_ms?: number; end_ms?: number }
  // ) => {
  //   tempUpdateEvent({ variables: { event_id: props.event.id, text: data.text } });
  // };

  // const handleTextInputKeyDown = (
  //   e: React.KeyboardEvent<HTMLInputElement>,
  //   event: Irisub.Event
  // ) => {
  //   if (e.key === "Enter" && e.shiftKey) {
  //     updateEvent(event.index, {
  //       text: event.text + "\n",
  //     });
  //     return;
  //   }
  // };

  return (
    <input
      id={`timetable-input-text-${props.event.index}`}
      className={styles.input}
      tabIndex={props.event.index + 1}
      placeholder=""
      value={value.replaceAll("\n", "␤")}
      onChange={(e) => setValue(e.target.value)}
      // onChange={(changeEvent: any) =>
      //   updateEvent(props.event.index, {
      //     text: changeEvent.target.value.replaceAll("␤", "\n"),
      //   })
      // }
      // onKeyDown={(e) => handleTextInputKeyDown(e, props.event)}
      onFocus={() => {
        setEditingEventIndex(props.event.index);
        setEditing(true);
      }}
      onBlur={() => setEditing(false)}
    />
  );
};

export default EventTextInput;
