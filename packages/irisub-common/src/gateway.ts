import { Irisub } from "./irisub";

export namespace Gateway {
  export enum EventName {
    IDENTIFY_EVENT_SOURCE_CLIENT = "IDENTIFY_EVENT_SOURCE_CLIENT",
    UPSERT_CUES = "UPSERT_CUES",
    UPSERT_PROJECT = "UPSERT_PROJECT",
    UPSERT_TRACK = "UPSERT_TRACK",
    UPDATE_MODIFYING_CUE = "UPDATE_MODIFYING_CUE",
    GET_AVAILABLE_PROJECTS = "GET_AVAILABLE_PROJECTS",
  }

  export type IdentifyEventSourceClientEvent = {
    clientId: string;
  };

  export type UpsertCuesEvent = {
    cues: Irisub.Cue[];
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
}
