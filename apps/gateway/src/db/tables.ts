export interface ProjectTable {
  id: string;
  title: string;

  owner_user_id: string;
}

export interface TrackTable {
  id: string;
  name: string | null;
  language: string | null;

  project_id: string;
}

export interface CueTable {
  id: string;
  text: string;
  start_ms: number;
  end_ms: number;

  project_id: string;
  track_id: string;
}

export interface CollaborationTable {
  user_id: string;
  project_id: string;
}
