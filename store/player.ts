import { atom } from "recoil";

export const playerProgressState = atom({
  key: "playerProgressState",
  default: 0,
});

export const timetableActiveRowState = atom({
  key: "timetableActiveRowState",
  default: 0,
});

export const timetableDataState = atom({
  key: "timetableDataState",
  default: [] as string[],
});
