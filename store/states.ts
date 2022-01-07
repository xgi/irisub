import { IDBPDatabase } from "idb";
import { atom } from "recoil";
import { DB_STORES } from "./db";
import { IrisubDBSchema } from "./types";

export const databaseState = atom<IDBPDatabase<IrisubDBSchema> | null>({
  key: "database",
  default: null,
});

export const currentProjectState = atom<Irisub.Project | null>({
  key: "currentProjectState",
  default: null,
  effects_UNSTABLE: [
    ({ onSet, getPromise }) => {
      onSet(async (newValue, _oldValue, isReset: boolean) => {
        getPromise(databaseState).then((database) => {
          if (database && newValue) {
            isReset
              ? database.delete(DB_STORES.PROJECT, newValue.id)
              : database.put(DB_STORES.PROJECT, newValue);
          }
        });
      });
    },
  ],
});

const currentTrackState = atom<string | null>({
  key: "currentTrackState",
  default: null,
});

export const currentEventIndexState = atom<number>({
  key: "currentEventIndexState",
  default: 0,
  effects_UNSTABLE: [
    ({ onSet, setSelf, getPromise }) => {
      onSet(async (newValue, oldValue) => {
        if (newValue < 0) setSelf(oldValue);

        const eventList = await getPromise(currentEventListState);
        const lastIndex = eventList.length - 1;
        if (newValue > lastIndex) setSelf(oldValue);
      });
    },
  ],
});

export const currentEventListState = atom<Irisub.Event[]>({
  key: "currentEventListState",
  default: [],
  effects_UNSTABLE: [
    ({ onSet, getPromise }) => {
      onSet(async (newValue, _oldValue) => {
        if (!newValue) {
          return;
        }

        // TODO: only put changed events
        getPromise(databaseState).then((database) => {
          if (database) {
            newValue.forEach((event) => {
              database.put(DB_STORES.EVENT, event);
            });
          }
        });
      });
    },
  ],
});

const currentCommentListState = atom<Irisub.Comment[]>({
  key: "currentCommentListState",
  default: [],
});

const currentStyleSheetListState = atom<Irisub.StyleSheet[]>({
  key: "currentStylesheetListState",
  default: [],
});
