import { child, ref, getDatabase, onValue, update, get, DataSnapshot } from "firebase/database";
import { Irisub } from "irisub-common";
import { atom, AtomEffect } from "recoil";
import { currentProjectIdState } from "./states";

const snapshotToEventList = (snapshot: DataSnapshot): Irisub.Event[] => {
  if (snapshot.exists()) {
    const entries = Object.entries(snapshot.val());
    const events: Irisub.Event[] = entries.map(([id, event]: [string, any]) => ({
      index: event.index,
      text: event.text,
      start_ms: event.start_ms,
      end_ms: event.end_ms,
    }));
    return events;
  } else {
    return [];
  }
};

const getRemoteEventList = async (projectId: string | null): Promise<Irisub.Event[] | null> => {
  if (projectId === null) return null;

  return get(child(ref(getDatabase()), `events/${projectId}/MYTRACK`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshotToEventList(snapshot);
      }
      return [];
    })
    .catch(() => {
      return [];
    });
};

function syncEventListEffect(): AtomEffect<Irisub.Event[] | null> {
  return ({ setSelf, onSet, trigger, getPromise, getLoadable }) => {
    const projectId = getLoadable(currentProjectIdState).getValue();

    if (projectId !== null) {
      if (trigger === "get") {
        getRemoteEventList(projectId).then((events) => setSelf(events));
      }

      onValue(ref(getDatabase(), `events/${projectId}/MYTRACK`), (snapshot) => {
        if (snapshot.exists()) setSelf(snapshotToEventList(snapshot));
      });
    }

    onSet((newValue, oldValue, isReset) => {
      // TODO: only update modified events, and use transaction
      // const newKeys = Object.keys(newValue).filter((key) => !Object.keys(oldValue).includes(key));
      const projectId = getLoadable(currentProjectIdState).getValue();

      if (isReset || newValue === null) {
        getRemoteEventList(projectId).then((events) => setSelf(events));
      } else {
        if (newValue !== null) {
          const _temp = new Map(newValue.map((obj) => [obj.index, { ...obj }]));
          update(ref(getDatabase(), `events/${projectId}/MYTRACK`), Object.fromEntries(_temp));
        }
      }
    });
  };
}

export const currentEventListState = atom<Irisub.Event[] | null>({
  key: "currentEventListState",
  default: null,
  effects: [syncEventListEffect()],
});
