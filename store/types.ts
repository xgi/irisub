import { DBSchema } from "idb";

export interface IrisubDBSchema extends DBSchema {
  project: {
    key: string;
    value: Irisub.Project;
  };

  track: {
    key: string;
    value: Irisub.Track;
    indexes: { "by-project": string };
  };

  event: {
    key: string;
    value: Irisub.Event;
    indexes: { "by-project": string };
  };

  comment: {
    key: string;
    value: Irisub.Comment;
    indexes: { "by-project": string };
  };

  stylesheet: {
    key: string;
    value: Irisub.StyleSheet;
    indexes: { "by-project": string };
  };
}
