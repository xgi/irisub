export interface ProjectTable {
  id: string;
  title: string;

  creator_user_id: string;
  team_id: string | null;

  created_at: string;
  updated_at: string;
}

export interface TrackTable {
  id: string;
  name: string | null;
  language: string | null;

  project_id: string;

  created_at: string;
  updated_at: string;
}

export interface CueTable {
  id: string;
  text: string;
  start_ms: number;
  end_ms: number;

  project_id: string;
  track_id: string;

  created_at: string;
  updated_at: string;
}

export interface TeamTable {
  id: string;
  name: string;

  created_at: string;
  updated_at: string;
}

export interface CollaboratorTable {
  user_id: string;
  team_id: string;

  email: string;
  role: 'owner' | 'editor';

  created_at: string;
  updated_at: string;
}

export interface InvitationTable {
  id: string;

  sender_user_id: string;
  team_id: string;
  invitee_email: string;
  invitee_role: 'owner' | 'editor';

  created_at: string;
}
