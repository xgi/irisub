import { atom } from "recoil";

export const tracksModalOpenState = atom<boolean>({
  key: "tracksModalOpenState",
  default: false,
});
