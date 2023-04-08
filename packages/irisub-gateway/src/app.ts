import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import cookieParser from "cookie-parser";
import admin from "firebase-admin";
import { handleSessionCookieAuth } from "./middleware/auth_middleware";
import { Gateway, Irisub } from "irisub-common";
import { db } from "./db/database";
import { initializeFirebase } from "./firebase";

const app = express();
const port = 3123;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(/\/((?!sessionLogin).)*/, handleSessionCookieAuth);

initializeFirebase();

/** Auth */

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 1000 * 60 * 60 * 24 * 5;
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        res.cookie("session", sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        console.error(error);
        res.status(401).send("Unauthorized");
      },
    );
});

/** Event source */

type EventSourceClient = {
  id: string;
  uid: string;
  res: Response;
};

const clients: { [projectId: string]: EventSourceClient[] } = {};

const sendGatewayEvent = (
  eventName: Gateway.EventName,
  data: Gateway.Event,
  client: EventSourceClient,
) => {
  client.res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
};

app.get("/events", (req, res) => {
  const projectId = req.query["projectId"] as string;
  if (!projectId) {
    res.status(400).send("Project ID not included in request");
    return;
  }

  // TODO: validate client has auth on project ID

  console.log("handling events...");
  console.log(req.query["projectId"]);

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const client = {
    id: uuidv4(),
    uid: res.locals.uid,
    res: res,
  };
  if (!clients[projectId]) clients[projectId] = [];
  clients[projectId].push(client);

  const identifyEvent: Gateway.IdentifyEventSourceClientEvent = {
    clientId: client.id,
  };
  sendGatewayEvent(Gateway.EventName.IDENTIFY_EVENT_SOURCE_CLIENT, identifyEvent, client);

  req.on("close", () => {
    console.log(`${client.id} connection closed`);
    clients[projectId] = clients[projectId].filter((c) => c.id !== client.id);
  });
});

/** REST API */

app.get("/projects", async (req, res) => {
  console.log(`Getting projects for user ${res.locals.uid}`);

  const projects: Irisub.Project[] = (await db
    .selectFrom("project")
    .selectAll()
    .execute()) satisfies Irisub.Project[];
  res.send({ projects: projects });
});

app.get("/projects/:projectId", async (req, res) => {
  const { projectId } = req.params;

  console.log(`Getting project ${projectId}`);

  const project: Irisub.Project | undefined = await db
    .selectFrom("project")
    .where("id", "=", projectId)
    .selectAll()
    .executeTakeFirst();

  if (project === undefined) {
    res.status(404).send("Project not found");
    return;
  }

  res.send({ project: project });
});

app.get("/projects/:projectId/tracks", async (req, res) => {
  const { projectId } = req.params;

  console.log(`Getting tracks for project ${projectId}`);

  const tracks: Irisub.Track[] = await db
    .selectFrom("track")
    .where("project_id", "=", projectId)
    .selectAll()
    .execute();

  res.send({ tracks: tracks });
});

app.get("/projects/:projectId/tracks/:trackId", async (req, res) => {
  const { projectId, trackId } = req.params;

  console.log(`Getting track ${trackId}`);

  const track: Irisub.Track | undefined = await db
    .selectFrom("track")
    .where("id", "=", trackId)
    .where("project_id", "=", projectId)
    .selectAll()
    .executeTakeFirst();

  if (track === undefined) {
    res.status(404).send("Track not found");
    return;
  }

  res.send({ track: track });
});

app.get("/projects/:projectId/tracks/:trackId/cues", async (req, res) => {
  const { projectId, trackId } = req.params;

  console.log(`Getting cues for project ${projectId} track ${trackId}`);

  const cues: Irisub.Cue[] = await db
    .selectFrom("cue")
    .where("project_id", "=", projectId)
    .where("track_id", "=", trackId)
    .selectAll()
    .execute();

  res.send({ cues: cues });
});

app.post("/projects/:projectId", async (req, res) => {
  const eventSourceClientId = req.headers["gateway-event-source-client-id"];
  const { projectId } = req.params;

  const newProject: Irisub.Project = req.body.project;
  if (newProject.id !== projectId) {
    res.status(400).send("Project ID in body does not match URL parameter");
    return;
  }

  console.log(`Upserting project with ID ${projectId}`);

  await db.insertInto("project").values(newProject).execute();

  if (clients[projectId]) {
    clients[projectId].forEach((client) => {
      if (client.id !== eventSourceClientId) {
        console.log(`Sending message to client ${client.id} (uid ${client.uid})`);
        const gwEvent: Gateway.UpsertProjectEvent = {
          project: newProject,
        };
        sendGatewayEvent(Gateway.EventName.UPSERT_PROJECT, gwEvent, client);
      }
    });
  }

  res.end();
});

app.post("/projects/:projectId/tracks/:trackId", async (req, res) => {
  const eventSourceClientId = req.headers["gateway-event-source-client-id"];
  const { projectId, trackId } = req.params;

  const newTrack: Irisub.Track = req.body.track;
  if (newTrack.id !== trackId) {
    res.status(400).send("Track ID in body does not match URL parameter");
    return;
  }

  console.log(`Upserting track with ID ${trackId} on project ${projectId}`);

  await db
    .insertInto("track")
    .values({ ...newTrack, project_id: projectId })
    .execute();

  if (clients[projectId]) {
    clients[projectId].forEach((client) => {
      if (client.id !== eventSourceClientId) {
        console.log(`Sending message to client ${client.id} (uid ${client.uid})`);
        const gwEvent: Gateway.UpsertTrackEvent = {
          track: newTrack,
        };
        sendGatewayEvent(Gateway.EventName.UPSERT_TRACK, gwEvent, client);
      }
    });
  }

  res.end();
});

app.post("/projects/:projectId/tracks/:trackId/cues", async (req, res) => {
  const eventSourceClientId = req.headers["gateway-event-source-client-id"];
  const { projectId, trackId } = req.params;

  console.log(`Posting cues for project: ${projectId} track: ${trackId}`);

  const newCues: Irisub.Cue[] = req.body.cues;
  await db
    .insertInto("cue")
    .values(newCues.map((cue) => ({ ...cue, project_id: projectId, track_id: trackId })))
    .onConflict((oc) =>
      oc.doUpdateSet((eb) => ({
        text: eb.ref("excluded.text"),
        start_ms: eb.ref("excluded.start_ms"),
        end_ms: eb.ref("excluded.end_ms"),
      })),
    )
    .execute();

  if (clients[projectId]) {
    clients[projectId].forEach((client) => {
      if (client.id !== eventSourceClientId) {
        console.log(`Sending message to client ${client.id} (uid ${client.uid})`);
        const gwEvent: Gateway.UpsertCuesEvent = {
          cues: req.body.cues,
        };
        sendGatewayEvent(Gateway.EventName.UPSERT_CUES, gwEvent, client);
      }
    });
  }

  res.end();
});

const expressServer = app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
