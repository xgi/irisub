// export as namespace Irisub;
export namespace Irisub {
  export type Project = {
    id: string;
    title?: string;
  };

  export type Track = {
    id: string;
    name?: string;
    language?: string;
  };

  export type Event = {
    id: string;
    // project_id: string;
    // track_id: string;
    index: number;
    // name?: string;
    text: string;
    // actor: string;
    start_ms: number;
    end_ms: number;
    // settings?: {
    //   vertical?: string;
    //   line?: string;
    //   position?: string;
    //   size?: string;
    //   align?: string;
    // };
  };

  export type Comment = {
    id: string;
    project_id: string;
    track_id: string;
    previous_event_id: string | null;
    next_event_id: string | null;
    text: string;
  };

  export type StyleSheet = {
    id: string;
    project_id: string | null;
    track_id: string | null;
    name?: string;
    styleGroups: {
      selectors: string[];
      styles: { [key: string]: string };
    }[];
  };
}
