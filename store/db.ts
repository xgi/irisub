import { openDB } from "idb";
import { IrisubDBSchema } from "./types";

export enum DB_STORES {
  PROJECT = "project",
  TRACK = "track",
  EVENT = "event",
  COMMENT = "comment",
  STYLESHEET = "stylesheet",
}

export async function initDb() {
  return openDB<IrisubDBSchema>("irisub-db", 1, {
    upgrade(db) {
      db.createObjectStore("project", { keyPath: "id" });

      const trackStore = db.createObjectStore("track", {
        keyPath: "id",
      });
      trackStore.createIndex("by-project", "project_key");

      const eventStore = db.createObjectStore("event", {
        keyPath: "id",
      });
      eventStore.createIndex("by-project", "project_key");

      const commentStore = db.createObjectStore("comment", {
        keyPath: "id",
      });
      commentStore.createIndex("by-project", "project_key");

      const stylesheetStore = db.createObjectStore("stylesheet", {
        keyPath: "id",
      });
      stylesheetStore.createIndex("by-project", "project_key");
    },
  });
}
