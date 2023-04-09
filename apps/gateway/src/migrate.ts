import { Migration, MigrationProvider, Migrator } from 'kysely';
import { db } from './db/database.server';
import { _001 } from './db/migrations';

class CustomMigrationProvider implements MigrationProvider {
  async getMigrations(): Promise<Record<string, Migration>> {
    return { '001-initial': _001 };
  }
}

export async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new CustomMigrationProvider(),
    migrationTableSchema: 'kysely_migration',
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`Migration "${result.migrationName}" was executed successfully.`);
    } else if (result.status === 'Error') {
      console.error(`Failed to execute migration "${result.migrationName}".`);
    }
  });

  if (error) {
    console.error('Failed to run migrations!');
    console.error(error);
    process.exit(1);
  }
}
