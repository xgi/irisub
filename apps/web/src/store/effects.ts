import { AtomEffect } from 'recoil';
import { gateway } from '../services/gateway';
import { Gateway, Irisub } from '@irisub/shared';
import { shallowEqual } from '../util/comparison';
import {
  currentCueListState,
  currentProjectIdState,
  currentTrackIdState,
  currentTrackListState,
} from './states';

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

export function syncCueListEffect(): AtomEffect<Irisub.Cue[] | null> {
  return ({ setSelf, onSet, trigger, getLoadable }) => {
    const _load = () => {
      const projectId = getLoadable(currentProjectIdState).getValue();
      const trackId = getLoadable(currentTrackIdState).getValue();

      console.log(`Cue list was null, retrieving from project: ${projectId} track: ${trackId}`);
      if (projectId && trackId) {
        gateway.getCues(projectId, trackId).then((cues) => setSelf(cues));
      }
    };

    if (trigger === 'get') _load();

    onSet((newCueList, oldCueList) => {
      if (newCueList === null) {
        _load();
        return;
      }

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

      const projectId = getLoadable(currentProjectIdState).getValue();
      const trackId = getLoadable(currentTrackIdState).getValue();
      if (projectId && trackId) {
        gateway.upsertCues(projectId, trackId, modifiedCues);
      } else {
        console.log(`projectId: ${projectId} trackId: ${trackId}`);
        throw Error('Tried to upsert cues, but projectId or trackId was null');
      }
    });

    const unsubscribe = gateway.subscribe(Gateway.EventName.UPSERT_CUES, (gwEvent) => {
      const upsertEvent = gwEvent as Gateway.UpsertCuesEvent;

      const currentTrackId = getLoadable(currentTrackIdState).getValue();
      if (currentTrackId !== upsertEvent.trackId) return;

      const currentCueList = getLoadable(currentCueListState).getValue();
      const current = currentCueList ? [...currentCueList] : [];
      const updatedCues = upsertEvent.cues;

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

export function syncProjectEffect(): AtomEffect<Irisub.Project | null> {
  return ({ setSelf, onSet, trigger, getLoadable }) => {
    const _load = () => {
      const projectId = getLoadable(currentProjectIdState).getValue();

      console.log(`Project was null, retrieving with ID: ${projectId}`);
      if (projectId) {
        gateway.getProject(projectId).then((project) => {
          console.log(`Got initial project: ${JSON.stringify(project)}`);
          setSelf(project);
        });
      }
    };

    if (trigger === 'get') _load();

    onSet((newProject) => {
      if (newProject) {
        gateway.upsertProject(newProject);
      } else {
        _load();
      }
    });

    const unsubscribe = gateway.subscribe(Gateway.EventName.UPSERT_PROJECT, (gwEvent) => {
      const newProject = (gwEvent as Gateway.UpsertProjectEvent).project;
      setSelf(newProject);
    });
    return () => unsubscribe();
  };
}

export function syncTrackListEffect(): AtomEffect<Irisub.Track[] | null> {
  return ({ setSelf, onSet, trigger, getLoadable }) => {
    const _load = () => {
      const projectId = getLoadable(currentProjectIdState).getValue();

      console.log(`Track list was null, retrieving from project: ${projectId}`);
      if (projectId) {
        gateway.getTracks(projectId).then((tracks) => {
          console.log(`Got initial tracks: ${JSON.stringify(tracks)}`);
          setSelf(tracks);
        });
      }
    };

    if (trigger === 'get') _load();

    onSet((newTrackList) => {
      const projectId = getLoadable(currentProjectIdState).getValue();
      if (newTrackList && projectId) {
        newTrackList.forEach((newTrack) => {
          gateway.upsertTrack(projectId, newTrack);
        });
      } else {
        _load();
      }
    });

    const unsubscribe = gateway.subscribe(Gateway.EventName.UPSERT_TRACK, (gwEvent) => {
      const newTrack = (gwEvent as Gateway.UpsertTrackEvent).track;

      const currentTrackList = getLoadable(currentTrackListState).getValue();
      if (currentTrackList === null) return;

      const existingTrackIndex = currentTrackList?.findIndex((t) => t.id === newTrack.id);

      if (existingTrackIndex === -1) {
        setSelf([...currentTrackList, newTrack]);
      } else {
        const newTrackList = [...currentTrackList];
        newTrackList[existingTrackIndex] = newTrack;
        setSelf(newTrackList);
      }
    });
    return () => unsubscribe();
  };
}
