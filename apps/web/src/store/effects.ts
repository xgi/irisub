import { AtomEffect } from "recoil";
import { getDatabase, ref, child, get, onValue, DataSnapshot, set } from "firebase/database";
import { Irisub } from "irisub-common";

export function localStorageEffect<T>(storeKey: string): AtomEffect<T> {
  return ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(storeKey);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(storeKey)
        : localStorage.setItem(storeKey, JSON.stringify(newValue));
    });
  };
}

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

export function syncStorageEffect(): AtomEffect<Irisub.Event[]> {
  return ({ setSelf, onSet, trigger }) => {
    if (trigger === "get") {
      const dbRef = ref(getDatabase());

      get(child(dbRef, "events/MYPROJECT/MYTRACK"))
        .then((snapshot) => {
          if (snapshot.exists()) setSelf(snapshotToEventList(snapshot));
        })
        .catch((error) => {
          console.error(error);
        });
    }

    const eventsRef = ref(getDatabase(), "events/MYPROJECT/MYTRACK");
    onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) setSelf(snapshotToEventList(snapshot));
    });

    onSet((newValue, oldValue) => {
      // TODO: only update modified events
      // const newKeys = Object.keys(newValue).filter((key) => !Object.keys(oldValue).includes(key));

      const _temp = new Map(newValue.map((obj) => [obj.index, { ...obj }]));
      set(eventsRef, Object.fromEntries(_temp));
    });
  };
}
