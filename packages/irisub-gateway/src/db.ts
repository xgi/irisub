type Cue = {
  id: string;
  index: number;
  text: string;
  start_ms: number;
  end_ms: number;
};

export const db = {
  cues: [] as Cue[],
};
