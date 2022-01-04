export as namespace Irisub;

export type Project = {
  title?: string;
};

export type Track = {
  name?: string;
  language?: string;
}

export type Event = {
  project_key: string;
  track_key: string;
  name?: string;
  text: string;
  actor: string;
  start_ms: number;
  end_ms: number;
  settings?: {
    vertical?: string;
    line?: string;
    position?: string;
    size?: string;
    align?: string;
  };
};

export type Comment = {
  project_key: string;
  track_key: string;
  previous_event_key: string | null;
  next_event_key: string | null;
  text: string;
};

export type StyleSheet = {
  project_key: string | null;
  track_key: string | null;
  name?: string;
  styleGroups: {
    selectors: string[];
    styles: { [key: string]: string };
  }[];
};
