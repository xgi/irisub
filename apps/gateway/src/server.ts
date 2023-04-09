import express, { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import { handleSessionCookieAuth } from './middleware/auth_middleware';
import { Gateway, Irisub } from '@irisub/shared';
import { db } from './db/database.server';
import { initializeFirebase } from './firebase';
import { ProjectTable } from './db/tables';
import { Selectable } from 'kysely';

const app = express();
const port = 3123;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(/\/((?!sessionLogin).)*/, handleSessionCookieAuth);

/** Auth */

app.post('/sessionLogin', (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 1000 * 60 * 60 * 24 * 5;
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        res.cookie('session', sessionCookie, {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
        });
        res.end(JSON.stringify({ status: 'success' }));
      },
      (error) => {
        console.error(error);
        res.status(401).send('Unauthorized');
      }
    );
});

/** Helpers */

type ProjectPermission = 'owner' | 'collaborator' | 'doesnotexist' | 'unauthorized';

const checkProjectPermission = async (
  projectId: string,
  userId: string
): Promise<{ permission: ProjectPermission; project?: Selectable<ProjectTable> }> => {
  const project = await db
    .selectFrom('project')
    .where('id', '=', projectId)
    .selectAll()
    .executeTakeFirst();

  if (project === undefined) return { permission: 'doesnotexist' };
  if (project.owner_user_id === userId) return { permission: 'owner', project: project };

  const collaboration = await db
    .selectFrom('collaboration')
    .where('project_id', '=', projectId)
    .where('user_id', '=', userId)
    .executeTakeFirst();

  if (collaboration === undefined) return { permission: 'unauthorized', project: project };
  return { permission: 'collaborator', project: project };
};

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
  client: EventSourceClient
) => {
  client.res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
};

app.get('/events', async (req, res) => {
  const projectId = req.query['projectId'] as string;
  if (!projectId) {
    res.status(400).send('Project ID not included in request');
    return;
  }

  const { permission } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'doesnotexist') {
    res.status(404).send('Project not found');
    return;
  }
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
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

  req.on('close', () => {
    console.log(`${client.id} connection closed`);
    clients[projectId] = clients[projectId].filter((c) => c.id !== client.id);
  });
});

/** REST API */

app.get('/projects', async (req, res) => {
  const joinedProjectIds = (
    await db
      .selectFrom('collaboration')
      .where('user_id', '=', res.locals.uid)
      .select('project_id')
      .execute()
  ).map((collaboration) => collaboration.project_id);

  const projects: Irisub.Project[] = await db
    .selectFrom('project')
    .where(({ or, cmpr }) =>
      or([cmpr('id', 'in', joinedProjectIds), cmpr('owner_user_id', '=', res.locals.uid)])
    )
    .select('id')
    .select('title')
    .execute();

  res.send({ projects: projects });
});

app.get('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;

  const { permission, project } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'doesnotexist') {
    res.status(404).send('Project not found');
    return;
  }
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  res.send({ project: project });
});

app.get('/projects/:projectId/tracks', async (req, res) => {
  const { projectId } = req.params;

  const { permission } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'doesnotexist') {
    res.status(404).send('Project not found');
    return;
  }
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  const tracks: Irisub.Track[] = await db
    .selectFrom('track')
    .where('project_id', '=', projectId)
    .selectAll()
    .execute();

  res.send({ tracks: tracks });
});

app.get('/projects/:projectId/tracks/:trackId', async (req, res) => {
  const { projectId, trackId } = req.params;

  const { permission } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'doesnotexist') {
    res.status(404).send('Project not found');
    return;
  }
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  const track: Irisub.Track | undefined = await db
    .selectFrom('track')
    .where('id', '=', trackId)
    .where('project_id', '=', projectId)
    .selectAll()
    .executeTakeFirst();

  if (track === undefined) {
    res.status(404).send('Track not found');
    return;
  }

  res.send({ track: track });
});

app.get('/projects/:projectId/tracks/:trackId/cues', async (req, res) => {
  const { projectId, trackId } = req.params;

  const { permission } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'doesnotexist') {
    res.status(404).send('Project not found');
    return;
  }
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  const cues: Irisub.Cue[] = await db
    .selectFrom('cue')
    .where('project_id', '=', projectId)
    .where('track_id', '=', trackId)
    .selectAll()
    .execute();

  res.send({ cues: cues });
});

app.post('/projects/:projectId', async (req, res) => {
  const eventSourceClientId = req.headers['gateway-event-source-client-id'];
  const { projectId } = req.params;

  const newProject: Irisub.Project = req.body.project;
  if (newProject.id !== projectId) {
    res.status(400).send('Project ID in body does not match URL parameter');
    return;
  }

  const { permission } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  await db
    .insertInto('project')
    .values({ ...newProject, owner_user_id: res.locals.uid })
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        title: eb.ref('excluded.title'),
      }))
    )
    .execute();

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

app.post('/projects/:projectId/tracks/:trackId', async (req, res) => {
  const eventSourceClientId = req.headers['gateway-event-source-client-id'];
  const { projectId, trackId } = req.params;

  const newTrack: Irisub.Track = req.body.track;
  if (newTrack.id !== trackId) {
    res.status(400).send('Track ID in body does not match URL parameter');
    return;
  }

  const { permission } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'doesnotexist') {
    res.status(404).send('Project not found');
    return;
  }
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  await db
    .insertInto('track')
    .values({ ...newTrack, project_id: projectId })
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        name: eb.ref('excluded.name'),
        language: eb.ref('excluded.language'),
      }))
    )
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

app.post('/projects/:projectId/tracks/:trackId/cues', async (req, res) => {
  const eventSourceClientId = req.headers['gateway-event-source-client-id'];
  const { projectId, trackId } = req.params;

  const { permission } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'doesnotexist') {
    res.status(404).send('Project not found');
    return;
  }
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  const newCues: Irisub.Cue[] = req.body.cues;
  await db
    .insertInto('cue')
    .values(
      newCues.map((cue) => ({
        ...cue,
        project_id: projectId,
        track_id: trackId,
      }))
    )
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        text: eb.ref('excluded.text'),
        start_ms: eb.ref('excluded.start_ms'),
        end_ms: eb.ref('excluded.end_ms'),
      }))
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

export const startServer = () => {
  initializeFirebase();
  return app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
  });
};
