import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("project")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("track")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("name", "varchar")
    .addColumn("language", "varchar")
    .addColumn("project_id", "varchar", (col) =>
      col.references("project.id").onDelete("cascade").notNull(),
    )
    .execute();

  await db.schema
    .createTable("cue")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("text", "varchar", (col) => col.notNull())
    .addColumn("start_ms", "integer", (col) => col.notNull())
    .addColumn("end_ms", "integer", (col) => col.notNull())
    .addColumn("project_id", "varchar", (col) =>
      col.references("project.id").onDelete("cascade").notNull(),
    )
    .addColumn("track_id", "varchar", (col) =>
      col.references("track.id").onDelete("cascade").notNull(),
    )
    .execute();

  await db.schema.createIndex("track_project_id_index").on("track").column("project_id").execute();
  await db.schema.createIndex("cue_project_id_index").on("cue").column("project_id").execute();
  await db.schema.createIndex("cue_track_id_index").on("cue").column("track_id").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("project").execute();
  await db.schema.dropTable("track").execute();
  await db.schema.dropTable("cue").execute();
}
