// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Irisub {
  export type Project = {
    id: string;
    title: string;
    team_id?: string;
  };

  export type Track = {
    id: string;
    name: string;
    languageCode: string;
  };

  export type Cue = {
    id: string;

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

  // export type Comment = {
  //   id: string;
  //   project_id: string;
  //   track_id: string;
  //   previous_event_id: string | null;
  //   next_event_id: string | null;
  //   text: string;
  // };

  export type StyleSheet = {
    id: string;
    project_id: string | null;
    name?: string;
    styleGroups: {
      selectors: string[];
      styles: { [key: string]: string };
    }[];
  };

  export type Team = {
    id: string;
    name: string;
  };
}
