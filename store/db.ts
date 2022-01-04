import { openDB } from "idb";
import { IrisubDBSchema } from "./types";

export async function initDb() {
  return openDB<IrisubDBSchema>("irisub-db", 1, {
    upgrade(db) {
      db.createObjectStore("project");

      const eventStore = db.createObjectStore("event");
      eventStore.createIndex("by-project", "project_key");

      const commentStore = db.createObjectStore("comment");
      commentStore.createIndex("by-project", "project_key");

      const stylesheetStore = db.createObjectStore("stylesheet");
      stylesheetStore.createIndex("by-project", "project_key");
    },
  });
}
