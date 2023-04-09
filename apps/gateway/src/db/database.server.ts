import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { ProjectTable, TrackTable, CueTable } from './tables';

interface Database {
  project: ProjectTable;
  track: TrackTable;
  cue: CueTable;
}

const dbConnStr = process.env.DB_CONNECTION_STRING;
if (!dbConnStr) {
  throw Error(
    'postgres connection string not found; expected in DB_CONNECTION_STRING environment variable'
  );
}

const dbSsl = process.env.DB_SSL === 'true';

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: dbConnStr,
      ssl: dbSsl,
    }),
  }),
});
