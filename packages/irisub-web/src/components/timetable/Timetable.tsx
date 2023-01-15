import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  editingEventIndexState,
  currentTrackIndexState,
  currentProjectIdState,
} from "../../store/states";
import styles from "../../styles/components/Timetable.module.scss";
import { classNames } from "../../util/layout";
import TimeInput from "../TimeInput";
import { Irisub } from "irisub-common";
import { playerPlayingState, playerProgressState } from "../../store/player";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import EventTextInput from "./EventTextInput";

const COMMENTS_SUBSCRIPTION = gql`
  subscription subscribeToEvents($project_id: uuid!) {
    events(where: { project_id: { _eq: $project_id } }) {
      id
      index
      start_ms
      end_ms
      text
    }
  }
`;

const GET_EVENTS = gql`
  query getAllEvents {
    events {
      id
      index
      text
      start_ms
      end_ms
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation updateEvent($event_id: uuid!, $text: String!) {
    update_events_by_pk(pk_columns: { id: $event_id }, _set: { text: $text }) {
      id
    }
  }
`;

type Props = {
  handleSeek: (value: number) => void;
};

const Timetable: React.FC<Props> = (props: Props) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useRecoilState(currentTrackIndexState);
  const [currentProjectId, setCurrentProjectId] = useRecoilState(currentProjectIdState);
  const [editingEventIndex, setEditingEventIndex] = useRecoilState(editingEventIndexState);
  const [playerProgress, setPlayerProgress] = useRecoilState(playerProgressState);
  const [playerPlaying, setPlayerPlaying] = useRecoilState(playerPlayingState);

  const eventListSubscription = useSubscription(COMMENTS_SUBSCRIPTION, {
    variables: { project_id: currentProjectId },
  });
  const [tempUpdateEvent, { data, loading, error }] = useMutation(UPDATE_EVENT);

  const eventList = eventListSubscription.data ? eventListSubscription.data.events : [];

  // useEffect(() => {
  //   console.log("got new data from subscription (timetable):");
  //   console.log(eventListSubscription.data);
  // }, [eventListSubscription]);

  // useEffect(() => {
  //   if (eventList && eventList.length === 0) {
  //     if (currentTrackIndex === 0 || currentTrackIndex === null) {
  //       const introEvents = [
  //         "Welcome to Irisub! This is the first subtitle.",
  //         "To get started, click Select Video to choose a file or Youtube/Vimeo/etc. video.",
  //         "You can resize the panels on this page by clicking and dragging the dividers.",
  //         "Split text into multiple lines with Shift+Enter.\nThis is the second line.",
  //       ];

  //       setCurrentEventList(
  //         introEvents.map((text, index) => ({
  //           index: index,
  //           text: text,
  //           start_ms: index * 3000,
  //           end_ms: (index + 1) * 3000,
  //         }))
  //       );
  //     } else {
  //       addEvent();
  //     }
  //   }
  // }, [eventList]);

  // TODO: show loader instead
  if (eventList === undefined) return <></>;

  const addEvent = (text = "") => {
    let startMs = 0;
    let endMs = 3000;

    if (eventList.length > 0) {
      const lastEvent = eventList[eventList.length - 1];
      startMs = lastEvent.end_ms;
      endMs = startMs + 3000;
    }

    // setCurrentEventList([
    //   ...eventList,
    //   { index: eventList.length, text: text, start_ms: startMs, end_ms: endMs },
    // ]);
  };

  const updateEvent = (
    index: number,
    data: { text?: string; start_ms?: number; end_ms?: number }
  ) => {
    // const newEvent: Irisub.Event = { ...eventList[index] };
    // if (data.text !== undefined) newEvent.text = data.text;
    // if (data.start_ms !== undefined) newEvent.start_ms = data.start_ms;
    // if (data.end_ms !== undefined) newEvent.end_ms = data.end_ms;

    // const _temp = [...eventList];
    // _temp[index] = newEvent;
    // setCurrentEventList(_temp);

    const oldEvent = eventList[index];
    console.log(`changing ${oldEvent.text} to ${data.text}`);

    tempUpdateEvent({ variables: { event_id: oldEvent.id, text: data.text } });
  };

  const renderRowStatusCell = (event: Irisub.Event) => {
    const playerProgressMs = playerProgress * 1000;
    const active = playerProgressMs >= event.start_ms && playerProgressMs < event.end_ms;

    if (active) {
      return (
        <td
          className={styles.iconCell}
          onClick={() => {
            if (!playerPlaying) props.handleSeek(event.start_ms / 1000);
            setPlayerPlaying(!playerPlaying);
          }}
        >
          <span
            className={classNames(
              styles.statusIcon,
              playerPlaying ? styles.playing : styles.paused
            )}
          >
            ➤
          </span>
        </td>
      );
    }
    return (
      <td
        className={styles.iconCell}
        onClick={() => {
          setPlayerPlaying(false);
          props.handleSeek(event.start_ms / 1000);
        }}
      >
        <span className={classNames(styles.statusIcon, styles.jump)}>↪</span>
      </td>
    );
  };

  const handleInputMoveFocus = (
    e: React.KeyboardEvent<HTMLInputElement>,
    matchCursorPosition: boolean = true
  ) => {
    let delta = 0;
    if (e.key === "ArrowUp") delta = -1;
    if (e.key === "ArrowDown" || e.key === "Enter") delta = 1;

    if (delta != 0) {
      const inputId = e.currentTarget.id;
      const splitIdx = inputId.lastIndexOf("-");
      const eventIdx = parseInt(inputId.substring(splitIdx + 1, inputId.length));

      const newEventIdx = eventIdx + delta;
      const _move = () => {
        const newInputId = inputId.substring(0, splitIdx + 1) + newEventIdx;
        const newInput = document.getElementById(newInputId) as HTMLInputElement | null;
        if (newInput) {
          newInput.focus();
          e.preventDefault();

          if (matchCursorPosition) {
            newInput.setSelectionRange(
              e.currentTarget.selectionStart,
              e.currentTarget.selectionStart
            );
          }
        }
      };

      if (newEventIdx >= 0 && newEventIdx < eventList.length) {
        _move();
      } else if (newEventIdx >= eventList.length) {
        addEvent();
        setTimeout(() => _move(), 0);
      }
    }
  };

  const handleTextInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    event: Irisub.Event
  ) => {
    if (e.key === "Enter" && e.shiftKey) {
      updateEvent(event.index, {
        text: event.text + "\n",
      });
      return;
    }
    handleInputMoveFocus(e, false);
  };

  const getCPS = (event: Irisub.Event) => {
    const cps = Math.ceil(event.text.length / ((event.end_ms - event.start_ms) / 1000));
    if (cps === Infinity || Number.isNaN(cps)) return 0;
    return cps;
  };

  const renderRows = () => {
    if (currentTrackIndex === null) return;

    const _eventList = eventList
      .slice()
      .sort((a: Irisub.Event, b: Irisub.Event) => a.index - b.index);
    // _eventList[_eventList.length] = {
    //   index: _eventList.length,
    //   text: "",
    //   start_ms: 0,
    //   end_ms: 0,
    // };

    return _eventList.map((event: Irisub.Event) => {
      // TODO: avoid re-renders
      // https://alexsidorenko.com/blog/react-list-rerender/
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
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>#</th>
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
