import { child, ref, getDatabase, onValue, update, get, DataSnapshot } from "firebase/database";
import { Irisub } from "irisub-common";
import { atom, AtomEffect } from "recoil";
import { currentProjectIdState, currentTrackIndexState } from "./states";

const snapshotToTrackList = (snapshot: DataSnapshot): Irisub.Track[] => {
  if (snapshot.exists()) {
    const entries = Object.entries(snapshot.val());
    const tracks: Irisub.Track[] = entries.map(([id, track]: [string, any]) => ({
      index: track.index,
      name: track.name || undefined,
      language: track.language || undefined,
    }));
    return tracks;
  } else {
    return [];
  }
};

const trackListToSnapshot = (tracks: Irisub.Track[]) => {
  const _temp = new Map(tracks.map((obj) => [obj.index, { ...obj }]));

  _temp.forEach((track: Irisub.Track) => {
    Object.keys(track).forEach((key) => {
      const _key = key as keyof Irisub.Track;
      if (track[_key] === undefined) delete track[_key];
    });
  });

  return Object.fromEntries(_temp);
};

const getRemoteTrackList = async (projectId: string | null): Promise<Irisub.Track[] | null> => {
  if (projectId === null) return null;

  return get(child(ref(getDatabase()), `tracks/${projectId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshotToTrackList(snapshot);
      }
      return [];
    })
    .catch(() => {
      return [];
    });
};

function syncTrackListEffect(): AtomEffect<Irisub.Track[] | null> {
  return ({ setSelf, onSet, trigger, getPromise, getLoadable }) => {
    const projectId = getLoadable(currentProjectIdState).getValue();
    const trackIndex = getLoadable(currentTrackIndexState).getValue();

    if (projectId !== null) {
      if (trigger === "get") {
        getRemoteTrackList(projectId).then((tracks) => setSelf(tracks));
      }

      onValue(ref(getDatabase(), `tracks/${projectId}`), (snapshot) => {
        if (snapshot.exists()) setSelf(snapshotToTrackList(snapshot));
      });
    }

    onSet((newValue, oldValue, isReset) => {
      const projectId = getLoadable(currentProjectIdState).getValue();

      if (isReset || newValue === null) {
        getRemoteTrackList(projectId).then((tracks) => setSelf(tracks));
      } else {
        if (newValue !== null) {
          update(ref(getDatabase(), `tracks/${projectId}`), trackListToSnapshot(newValue));
        }
      }
    });
  };
}

export const currentTrackListState = atom<Irisub.Track[] | null>({
  key: "currentTrackListState",
  default: null,
  effects: [syncTrackListEffect()],
});
