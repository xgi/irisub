import { Irisub } from "irisub-common";
import { atom } from "recoil";

export const currentTrackListState = atom<Irisub.Track[]>({
  key: "currentTrackListState",
  default: [],
});