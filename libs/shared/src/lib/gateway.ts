import { Irisub } from './irisub';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Gateway {
  export enum EventName {
    IDENTIFY_EVENT_SOURCE_CLIENT = 'IDENTIFY_EVENT_SOURCE_CLIENT',
    UPSERT_CUES = 'UPSERT_CUES',
    UPSERT_PROJECT = 'UPSERT_PROJECT',
    UPSERT_TRACK = 'UPSERT_TRACK',
    UPDATE_MODIFYING_CUE = 'UPDATE_MODIFYING_CUE',
    GET_AVAILABLE_PROJECTS = 'GET_AVAILABLE_PROJECTS',
  }

  export type IdentifyEventSourceClientEvent = {
    clientId: string;
  };

  export type UpsertCuesEvent = {
    cues: Irisub.Cue[];
    trackId: string;
  };

  export type UpsertProjectEvent = {
    project: Irisub.Project;
  };

  export type UpsertTrackEvent = {
    track: Irisub.Track;
  };

  export type Event =
    | IdentifyEventSourceClientEvent
    | UpsertCuesEvent
    | UpsertProjectEvent
    | UpsertTrackEvent;

  type Timestamps = {
    created_at: string;
    updated_at: string;
  };

  export interface ErrorResponseBody {
    errorMessage: string;
  }

  export interface GetProjectsResponseBody {
    owned: (Irisub.Project & Timestamps)[];
    teams: { teamName: string; projects: (Irisub.Project & Timestamps)[] }[];
  }

  export interface GetTracksResponseBody {
    tracks: (Irisub.Track & Timestamps)[];
  }

  export interface GetProjectResponseBody {
    project: Irisub.Project & Timestamps;
  }

  export interface GetTrackResponseBody {
    track: Irisub.Track & Timestamps;
  }

  export interface GetCuesResponseBody {
    cues: Irisub.Cue[];
  }

  export interface GetTeamsResponseBody {
    teams: ({
      id: string;
      name: string;
      members: {
        id: string;
        email: string;
        role: 'owner' | 'editor';
      }[];
    } & Timestamps)[];
  }
}
