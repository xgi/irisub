import { atom } from 'recoil';
import { localStorageEffect } from './effects';
import storeKeys from '../constants/storeKeys.json';

const THEMES = ['system', 'light', 'dark'] as const;
const ACCENTS = [
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'yellow',
  'orange',
  'red',
  'pink',
] as const;

type Theme = typeof THEMES[number];
type Accent = typeof ACCENTS[number];

export const nextTheme = (theme: Theme) => {
  return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
};

export const nextAccent = (accent: Accent) => {
  return ACCENTS[(ACCENTS.indexOf(accent) + 1) % ACCENTS.length];
};

export const themeState = atom<typeof THEMES[number]>({
  key: 'themeState',
  default: 'system',
  effects: [localStorageEffect(storeKeys.WORKSPACE.THEME)],
});

export const accentState = atom<typeof ACCENTS[number]>({
  key: 'accentState',
  default: 'indigo',
  effects: [localStorageEffect(storeKeys.WORKSPACE.ACCENT)],
});
