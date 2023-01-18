import { gql, useMutation } from "@apollo/client";
import { Irisub } from "irisub-common";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { editingEventIndexState, editingEventState } from "../../store/states";
import styles from "../../styles/components/EventTextInput.module.scss";
import { useDebouncedValue } from "../../util/hooks";

type Props = {
  event: Irisub.Event;
  callback: (text: string) => void;
};

const EventTextInput: React.FC<Props> = (props: Props) => {
  const [editingEventIndex, setEditingEventIndex] = useRecoilState(editingEventIndexState);
  const [editingEvent, setEditingEvent] = useRecoilState(editingEventState);
  const [value, setValue] = useState(props.event.text);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) setEditingEvent({ ...props.event, text: value });
  }, [editing, value]);

  useEffect(() => {
    props.callback(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!editing) setValue(props.event.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.event.text]);

  const handleTextInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    event: Irisub.Event
  ) => {
    if (e.key === "Enter" && e.shiftKey) {
      setValue(value + "\n");
      return;
    }
  };

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
      onKeyDown={(e) => handleTextInputKeyDown(e, props.event)}
      onFocus={() => {
        setEditingEventIndex(props.event.index);
        setEditing(true);
      }}
      onBlur={() => setEditing(false)}
    />
  );
};

export default EventTextInput;
