import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { ProjectTable, TrackTable, CueTable } from "./tables";

interface Database {
  project: ProjectTable;
  track: TrackTable;
  cue: CueTable;
}

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new Database("irisub.db"),
  }),
});
