import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.executeQuery(
    sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = now(); 
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `.compile(db)
  );

  await db.schema
    .createTable('project')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('creator_user_id', 'varchar', (col) => col.notNull())
    .addColumn('team_id', 'varchar', (col) => col.references('team.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
  await db.executeQuery(
    sql`
        CREATE TRIGGER update_project_updated_at BEFORE UPDATE
        ON project FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    `.compile(db)
  );

  await db.schema
    .createTable('track')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('name', 'varchar')
    .addColumn('language', 'varchar')
    .addColumn('project_id', 'varchar', (col) =>
      col.references('project.id').onDelete('cascade').notNull()
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
  await db.executeQuery(
    sql`
          CREATE TRIGGER update_track_updated_at BEFORE UPDATE
          ON track FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    `.compile(db)
  );

  await db.schema
    .createTable('cue')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('text', 'varchar', (col) => col.notNull())
    .addColumn('start_ms', 'integer', (col) => col.notNull())
    .addColumn('end_ms', 'integer', (col) => col.notNull())
    .addColumn('project_id', 'varchar', (col) =>
      col.references('project.id').onDelete('cascade').notNull()
    )
    .addColumn('track_id', 'varchar', (col) =>
      col.references('track.id').onDelete('cascade').notNull()
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
  await db.executeQuery(
    sql`
          CREATE TRIGGER update_cue_updated_at BEFORE UPDATE
          ON cue FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    `.compile(db)
  );

  await db.schema
    .createTable('team')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
  await db.executeQuery(
    sql`
          CREATE TRIGGER update_team_updated_at BEFORE UPDATE
          ON team FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    `.compile(db)
  );

  await db.schema
    .createTable('collaborator')
    .addColumn('user_id', 'varchar', (col) => col.notNull())
    .addColumn('team_id', 'varchar', (col) =>
      col.references('team.id').onDelete('cascade').notNull()
    )
    .addColumn('email', 'varchar', (col) => col.notNull())
    .addColumn('role', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
  await db.executeQuery(
    sql`
          CREATE TRIGGER update_collaborator_updated_at BEFORE UPDATE
          ON collaborator FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    `.compile(db)
  );

  await db.schema.createIndex('track_project_id_index').on('track').column('project_id').execute();
  await db.schema.createIndex('cue_project_id_index').on('cue').column('project_id').execute();
  await db.schema.createIndex('cue_track_id_index').on('cue').column('track_id').execute();
  await db.schema
    .createIndex('collaborator_team_id_index')
    .on('collaborator')
    .column('team_id')
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('project').execute();
  await db.schema.dropTable('track').execute();
  await db.schema.dropTable('cue').execute();
  await db.schema.dropTable('collaborator').execute();
}
