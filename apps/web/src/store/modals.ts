import { atom } from 'recoil';

export const tracksModalOpenState = atom<boolean>({
  key: 'tracksModalOpenState',
  default: false,
});

export const importExportModalOpenState = atom<boolean>({
  key: 'importExportModalOpenState',
  default: false,
});
