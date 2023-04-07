import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import cookieParser from "cookie-parser";
import admin from "firebase-admin";
import { handleSessionCookieAuth } from "./middleware/auth_middleware";
import { Gateway, Irisub } from "irisub-common";
import { db } from "./db";

const app = express();
const port = 3003;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(/\/((?!sessionLogin).)*/, handleSessionCookieAuth);

admin.initializeApp();

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

app.get("/projects", (req, res) => {
  console.log(`Getting projects for user ${res.locals.uid}`);

  const projects = Object.values(db.projects);
  res.send({ projects: projects });
});

app.get("/projects/:projectId", (req, res) => {
  const { projectId } = req.params;

  console.log(`Getting project ${projectId}`);

  res.send({ project: db.projects[projectId] });
});

app.get("/projects/:projectId/tracks", (req, res) => {
  const { projectId } = req.params;

  console.log(`Getting tracks for project ${projectId}`);

  const tracks = Object.values(db.tracks[projectId]);
  res.send({ tracks: tracks });
});

app.get("/projects/:projectId/tracks/:trackId", (req, res) => {
  const { projectId, trackId } = req.params;

  console.log(`Getting track ${trackId}`);

  res.send({ track: db.tracks[projectId][trackId] });
});

app.get("/projects/:projectId/tracks/:trackId/cues", (req, res) => {
  const { projectId, trackId } = req.params;

  console.log(`Getting cues for project ${projectId} track ${trackId}`);

  res.send({ cues: db.cues[projectId][trackId] });
});

app.post("/projects/:projectId", (req, res) => {
  const eventSourceClientId = req.headers["gateway-event-source-client-id"];
  const { projectId } = req.params;

  const newProject: Irisub.Project = req.body.project;
  if (newProject.id !== projectId) {
    res.status(400).send("Project ID in body does not match URL parameter");
    return;
  }

  console.log(`Upserting project with ID ${projectId}`);

  db.cues[projectId] = {};
  db.projects[projectId] = {
    id: projectId,
    title: newProject.title,
  };

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

app.post("/projects/:projectId/tracks/:trackId", (req, res) => {
  const eventSourceClientId = req.headers["gateway-event-source-client-id"];
  const { projectId, trackId } = req.params;

  const newTrack: Irisub.Track = req.body.track;
  if (newTrack.id !== trackId) {
    res.status(400).send("Track ID in body does not match URL parameter");
    return;
  }

  console.log(`Upserting track with ID ${trackId} on project ${projectId}`);

  db.cues[projectId][trackId] = [];

  if (!db.tracks[projectId]) db.tracks[projectId] = {};
  db.tracks[projectId][trackId] = {
    id: trackId,
  };

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

app.post("/projects/:projectId/tracks/:trackId/cues", (req, res) => {
  const eventSourceClientId = req.headers["gateway-event-source-client-id"];
  const { projectId, trackId } = req.params;

  console.log(`Posting cues for project: ${projectId} track: ${trackId}`);

  req.body.cues.forEach((cue: Irisub.Cue) => {
    const existingIndex = db.cues[projectId][trackId].findIndex((c) => c.id === cue.id);
    if (existingIndex === -1) {
      db.cues[projectId][trackId].push(cue);
    } else {
      db.cues[projectId][trackId][existingIndex] = cue;
    }
  });

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
