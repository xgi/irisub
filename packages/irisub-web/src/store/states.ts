import { Irisub } from "irisub-common";
import { atom } from "recoil";
import { NavPage, EditorPanelTab, EditorElementKeys } from "../util/constants";
import { localStorageEffect, syncCueListEffect } from "./effects";
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

export const currentTrackIdState = atom<string | null>({
  key: "currentTrackIdState",
  default: null,
  effects: [localStorageEffect(storeKeys.WORKSPACE.CURRENT_TRACK_ID)],
});

export const currentCueListState = atom<Irisub.Event[]>({
  key: "currentCueListState",
  default: [],
  effects: [
    // localStorageEffect(storeKeys.WORKSPACE.CURRENT_PROJECT_ID)
    syncCueListEffect(),
  ],
});

export const editingEventIdState = atom<string | null>({
  key: "editingEventIdState",
  default: null,
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

export const gatewayConnectedState = atom<boolean>({
  key: "gatewayConnectedState",
  default: false,
});
