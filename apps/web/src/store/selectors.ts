import { selector } from 'recoil';
import { currentCueListState, currentTrackIdState, currentTrackListState } from './states';
import { Irisub } from '@irisub/shared';
import { playerProgressState } from './player';

export const currentTrackSelector = selector<Irisub.Track | null>({
  key: 'currentTrackSelector',
  get: ({ get }) => {
    const trackList = get(currentTrackListState);
    const trackId = get(currentTrackIdState);

    if (!trackId || !trackList) return null;

    return trackList.find((track) => track.id === trackId) || null;
  },
});

export const visibleCuesSelector = selector<Irisub.Cue[]>({
  key: 'visibleCuesSelector',
  get: ({ get }) => {
    const currentCueList = get(currentCueListState);
    if (!currentCueList) return [];

    const playerProgressMs = get(playerProgressState) * 1000;

    return currentCueList.filter(
      (cue) => playerProgressMs >= cue.start_ms && playerProgressMs < cue.end_ms
    );
  },
});

export const sortedCurrentCueListSelector = selector<Irisub.Cue[] | null>({
  key: 'sortedCurrentCueListSelector',
  get: ({ get }) => {
    const currentCueList = get(currentCueListState);

    if (!currentCueList) return currentCueList;
    return currentCueList.slice().sort((a: Irisub.Cue, b: Irisub.Cue) => a.start_ms - b.start_ms);
  },
});
