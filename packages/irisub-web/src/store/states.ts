import { Irisub } from "irisub-common";
import { atom } from "recoil";
import { NavPage, EditorPanelTab, EditorElementKeys } from "../util/constants";
import { localStorageEffect } from "./effects";
import storeKeys from "../constants/storeKeys.json";

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
  default: null,
  effects: [localStorageEffect(storeKeys.WORKSPACE.CURRENT_PROJECT_ID)],
});

export const currentTrackIndexState = atom<number>({
  key: "currentTrackIndexState",
  default: 0,
});

export const editingEventIndexState = atom<number>({
  key: "editingEventIndexState",
  default: 0,
  // effects: [
  //   ({ onSet, setSelf, getPromise }) => {
  //     onSet(async (newValue, oldValue) => {
  //       if (newValue < 0) setSelf(oldValue);

  //       const currentEventList = await getPromise(currentEventListState);
  //       if (currentEventList !== null) {
  //         const lastIndex = currentEventList.length - 1;
  //         if (newValue > lastIndex) setSelf(oldValue);
  //       }
  //     });
  //   },
  // ],
});

export const editingEventState = atom<Irisub.Event | null>({
  key: "editingEventState",
  default: null,
});

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
