import { Irisub } from "irisub-common";
import { atom } from "recoil";
import { NavPage, EditorPanelTab } from "../util/constants";

export const currentNavPageState = atom<NavPage>({
  key: "currentNavPageState",
  default: NavPage.Editor,
});

export const currentEditorPanelTabState = atom<EditorPanelTab>({
  key: "currentEditorPanelTabState",
  default: EditorPanelTab.Text,
});

export const currentProjectState = atom<Irisub.Project | null>({
  key: "currentProjectState",
  default: null,
});

export const currentTrackState = atom<Irisub.Track | null>({
  key: "currentTrackState",
  default: null,
});

export const currentEventIndexState = atom<number>({
  key: "currentEventIndexState",
  default: 0,
  effects: [
    ({ onSet, setSelf, getPromise }) => {
      onSet(async (newValue, oldValue) => {
        if (newValue < 0) setSelf(oldValue);

        const currentTrack = await getPromise(currentTrackState);
        if (currentTrack !== null) {
          const lastIndex = currentTrack.events.length - 1;
          if (newValue > lastIndex) setSelf(oldValue);
        }
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
