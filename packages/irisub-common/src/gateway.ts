export namespace Gateway {
  export enum EventName {
    UPSERT_CUES = "UPSERT_CUES",
    UPSERT_PROJECT = "UPSERT_PROJECT",
    UPDATE_MODIFYING_CUE = "UPDATE_MODIFYING_CUE",
  }

  export type UpsertCuesEvent = {
    n: EventName.UPSERT_CUES;
    d: {
      cueId: string;
    }[];
    s?: number;
  };

  export type UpsertProjectEvent = {
    n: EventName.UPSERT_PROJECT;
    d: {
      projectId: string;
    };
    s?: number;
  };

  export type UpdateModifyingCueEvent = {
    n: EventName.UPDATE_MODIFYING_CUE;
    d: {
      cueId: string | null;
    };
    s?: number;
  };

  export type Event = UpsertCuesEvent | UpsertProjectEvent | UpdateModifyingCueEvent;
}
