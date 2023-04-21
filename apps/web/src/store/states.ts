import { Irisub } from '@irisub/shared';
import { atom } from 'recoil';
import { EditorPanelTab, EditorElementKeys } from '../util/constants';
import {
  localStorageEffect,
  syncCueListEffect,
  syncProjectEffect,
  syncTrackListEffect,
} from './effects';
import storeKeys from '../constants/storeKeys.json';

export const userIdState = atom<string | null>({
  key: 'userIdState',
  default: null,
});

export const currentEditorPanelTabState = atom<EditorPanelTab>({
  key: 'currentEditorPanelTabState',
  default: EditorPanelTab.Text,
});

export const currentProjectIdState = atom<string | null>({
  key: 'currentProjectIdState',
  default: null,
  effects: [localStorageEffect(storeKeys.WORKSPACE.CURRENT_PROJECT_ID)],
});

export const currentTrackIdState = atom<string | null>({
  key: 'currentTrackIdState',
  default: null,
  effects: [localStorageEffect(storeKeys.WORKSPACE.CURRENT_TRACK_ID)],
});

export const currentProjectState = atom<Irisub.Project | null>({
  key: 'currentProjectState',
  default: null,
  effects: [syncProjectEffect()],
});

export const currentTrackListState = atom<Irisub.Track[] | null>({
  key: 'currentTrackListState',
  default: null,
  effects: [syncTrackListEffect()],
});

export const currentCueListState = atom<Irisub.Cue[] | null>({
  key: 'currentCueListState',
  default: null,
  effects: [
    // localStorageEffect(storeKeys.WORKSPACE.CURRENT_PROJECT_ID)
    syncCueListEffect(),
  ],
});

export const editingCueIdState = atom<string | null>({
  key: 'editingCueIdState',
  default: null,
});

export const editingCueState = atom<Irisub.Cue | null>({
  key: 'editingCueState',
  default: null,
});

export const editorElementSizesState = atom<{ [key: string]: number }>({
  key: 'editorElementSizesState',
  default: {
    [EditorElementKeys.Player]: 0.55,
    [EditorElementKeys.Timeline]: 0.125,
    [EditorElementKeys.Timetable]: 0.3,
  },
  effects: [localStorageEffect(storeKeys.WORKSPACE.EDITOR_ELEMENT_SIZES)],
});

export const editorShowMsState = atom<boolean>({
  key: 'editorShowMsState',
  default: true,
  effects: [localStorageEffect(storeKeys.WORKSPACE.EDITOR_SHOW_MS)],
});

export const gatewayConnectedState = atom<boolean>({
  key: 'gatewayConnectedState',
  default: false,
});
