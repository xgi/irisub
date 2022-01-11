import { atom } from "recoil";

export const playerProgressState = atom({
  key: "playerProgressState",
  default: 0,
});

export const playerDurationState = atom({
  key: "playerDurationState",
  default: 0,
});
