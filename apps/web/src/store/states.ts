import { Irisub } from "irisub-common";
import { atom, AtomEffect, selector, selectorFamily } from "recoil";
import { getDatabase, ref, child, push, update, get as dbGet, onValue } from "firebase/database";
import { NavPage, EditorPanelTab, EditorElementKeys } from "../util/constants";
import { localStorageEffect } from "./effects";
import storeKeys from "../constants/storeKeys.json";
import { currentEventListState } from "./events";

export const userIdState = atom<string | null>({
  key: "userIdState",
  default: null,
});

export const currentNavPageState = atom<NavPage>({
  key: "currentNavPageState",
  default: NavPage.Editor,
});

export const currentEditorPanelTabState = atom<EditorPanelTab>({
  key: "currentEditorPanelTabState",
  default: EditorPanelTab.Text,
});

export const currentProjectIdState = atom<string | null>({
  key: "currentProjectIdState",
  default: "MYPROJECT",
});

export const currentTrackState = atom<Irisub.Track | null>({
  key: "currentTrackState",
  default: null,
  effects: [localStorageEffect(storeKeys.WORKSPACE.CURRENT_TRACK)],
});

export const editingEventIndexState = atom<number>({
  key: "editingEventIndexState",
  default: 0,
  effects: [
    ({ onSet, setSelf, getPromise }) => {
      onSet(async (newValue, oldValue) => {
        if (newValue < 0) setSelf(oldValue);

        const currentEventList = await getPromise(currentEventListState);
        const lastIndex = currentEventList.length - 1;
        if (newValue > lastIndex) setSelf(oldValue);
      });
    },
  ],
});

// const currentCommentListState = atom<Irisub.Comment[]>({
//   key: "currentCommentListState",
//   default: [],
// });

// const currentStyleSheetListState = atom<Irisub.StyleSheet[]>({
//   key: "currentStylesheetListState",
//   default: [],
// });

export const editorElementSizesState = atom<{ [key: string]: number }>({
  key: "editorElementSizesState",
  default: {
    [EditorElementKeys.Player]: 0.55,
    [EditorElementKeys.Timeline]: 0.125,
    [EditorElementKeys.Timetable]: 0.3,
  },
  effects: [localStorageEffect(storeKeys.WORKSPACE.EDITOR_ELEMENT_SIZES)],
});

export const editorShowMsState = atom<boolean>({
  key: "editorShowMsState",
  default: true,
  effects: [localStorageEffect(storeKeys.WORKSPACE.EDITOR_SHOW_MS)],
});
