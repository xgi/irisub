import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { ProjectTable, TrackTable, CueTable } from "./tables";

interface Database {
  project: ProjectTable;
  track: TrackTable;
  cue: CueTable;
}

const dbPath = process.env.SQLITE_DB;
if (!dbPath) {
  throw Error("sqlite database path not found; expected in SQLITE_DB environment variable");
}

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new Database("irisub.db"),
  }),
});
