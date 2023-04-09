import { selector } from 'recoil';
import { currentTrackIdState, currentTrackListState } from './states';
import { Irisub } from '@irisub/shared';

export const currentTrackSelector = selector<Irisub.Track | null>({
  key: 'currentTrackSelector',
  get: ({ get }) => {
    const trackList = get(currentTrackListState);
    const trackId = get(currentTrackIdState);

    if (!trackId || !trackList) return null;

    return trackList.find((track) => track.id === trackId) || null;
  },
});
