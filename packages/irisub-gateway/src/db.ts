import { Irisub } from "irisub-common";

export const db: {
  cues: { [projectId: string]: { [trackId: string]: Irisub.Cue[] } };
  projects: { [projectId: string]: Irisub.Project };
  tracks: { [projectId: string]: { [trackId: string]: Irisub.Track } };
} = {
  cues: {},
  projects: {},
  tracks: {},
};
