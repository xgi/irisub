import { atom } from 'recoil';

export const tracksModalOpenState = atom<boolean>({
  key: 'tracksModalOpenState',
  default: false,
});

export const importExportModalOpenState = atom<boolean>({
  key: 'importExportModalOpenState',
  default: false,
});

export const loginModalOpenState = atom<boolean>({
  key: 'loginModalOpenState',
  default: false,
});

export const inviteModalOpenState = atom<boolean>({
  key: 'inviteModalOpenState',
  default: false,
});
