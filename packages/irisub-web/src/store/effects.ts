import { AtomEffect } from "recoil";
import { gateway } from "../services/gateway";
import { Gateway, Irisub } from "irisub-common";
import { shallowEqual } from "../util/comparison";
import { currentCueListState, currentProjectIdState, currentTrackIdState } from "./states";

export function localStorageEffect<T>(storeKey: string): AtomEffect<T> {
  return ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(storeKey);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(storeKey)
        : localStorage.setItem(storeKey, JSON.stringify(newValue));
    });
  };
}

export function syncCueListEffect(): AtomEffect<Irisub.Cue[]> {
  return ({ setSelf, onSet, trigger, getLoadable }) => {
    // if (trigger === 'get') {
    //   setSelf(myRemoteStorage.get(userID));
    // }

    onSet((newCueList, oldCueList) => {
      const oldCueMap: { [key: string]: Irisub.Cue } = {};
      Object.values(oldCueList as Irisub.Cue[]).forEach((oldCue) => {
        oldCueMap[oldCue.id] = { ...oldCue };
      });

      const modifiedCues: Irisub.Cue[] = [];
      newCueList.forEach((newCue) => {
        const existingCue = oldCueMap[newCue.id];
        if (existingCue === undefined || !shallowEqual(existingCue, newCue)) {
          modifiedCues.push(newCue);
        }
      });

      console.log("Modified cues (sending to server now):");
      console.log(modifiedCues);

      const projectId = getLoadable(currentProjectIdState).getValue();
      const trackId = getLoadable(currentTrackIdState).getValue();
      if (projectId && trackId) {
        gateway.upsertCues(projectId, trackId, modifiedCues);
      } else {
        throw "Tried to upsert cues, but projectId or trackId was null";
      }
    });

    const unsubscribe = gateway.subscribe(Gateway.EventName.UPSERT_CUES, (gwEvent) => {
      const current = [...getLoadable(currentCueListState).getValue()];
      const updatedCues = (gwEvent as Gateway.UpsertCuesEvent).cues;

      updatedCues.forEach((updatedCue) => {
        const originalCueIndex = current.findIndex((c) => c.id === updatedCue.id);
        if (originalCueIndex !== -1) {
          current[originalCueIndex] = { ...updatedCue };
        } else {
          current.push(updatedCue);
        }
      });

      setSelf(current);
    });

    return () => unsubscribe();
  };
}
