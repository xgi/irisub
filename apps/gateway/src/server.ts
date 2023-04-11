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

app.use((req, res, next) => {
  const start_time = Date.now();

  res.on('close', async () => {
    const now = Date.now();
    const logObj = {
      method: req.method,
      path: req.route.path,
      url: decodeURI(req.url),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      duration: now - start_time,
      modifiedRows: res.locals.modified_rows || 0,
    };
    console.log(JSON.stringify(logObj));
  });

  next();
});

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

  const collaborator = await db
    .selectFrom('collaborator')
    .where('project_id', '=', projectId)
    .where('user_id', '=', userId)
    .executeTakeFirst();

  if (collaborator === undefined) return { permission: 'unauthorized', project: project };
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

app.get(
  '/projects',
  async (req, res: Response<Gateway.GetProjectsResponseBody | Gateway.ErrorResponseBody>) => {
    const joinedProjectIds = (
      await db
        .selectFrom('collaborator')
        .where('user_id', '=', res.locals.uid)
        .select('project_id')
        .execute()
    ).map((collaborator) => collaborator.project_id);

    const owned = await db
      .selectFrom('project')
      .where('owner_user_id', '=', res.locals.uid)
      .selectAll()
      .execute();

    const joined =
      joinedProjectIds.length > 0
        ? await db.selectFrom('project').where('id', 'in', joinedProjectIds).selectAll().execute()
        : [];

    res.send({ owned: owned, joined: joined });
  }
);

app.get(
  '/projects/:projectId',
  async (req, res: Response<Gateway.GetProjectResponseBody | Gateway.ErrorResponseBody>) => {
    const { projectId } = req.params;

    const { permission, project } = await checkProjectPermission(projectId, res.locals.uid);
    if (permission === 'doesnotexist') {
      res.status(404).send({ errorMessage: 'Project not found' });
      return;
    }
    if (permission === 'unauthorized') {
      res.status(401).send({ errorMessage: 'Unauthorized' });
      return;
    }

    res.send({ project: project });
  }
);

app.get(
  '/projects/:projectId/tracks',
  async (req, res: Response<Gateway.GetTracksResponseBody | Gateway.ErrorResponseBody>) => {
    const { projectId } = req.params;

    const { permission } = await checkProjectPermission(projectId, res.locals.uid);
    if (permission === 'doesnotexist') {
      res.status(404).send({ errorMessage: 'Project not found' });
      return;
    }
    if (permission === 'unauthorized') {
      res.status(401).send({ errorMessage: 'Unauthorized' });
      return;
    }

    const tracks = await db
      .selectFrom('track')
      .where('project_id', '=', projectId)
      .selectAll()
      .execute();

    res.send({ tracks: tracks });
  }
);

app.get(
  '/projects/:projectId/tracks/:trackId',
  async (req, res: Response<Gateway.GetTrackResponseBody | Gateway.ErrorResponseBody>) => {
    const { projectId, trackId } = req.params;

    const { permission } = await checkProjectPermission(projectId, res.locals.uid);
    if (permission === 'doesnotexist') {
      res.status(404).send({ errorMessage: 'Project not found' });
      return;
    }
    if (permission === 'unauthorized') {
      res.status(401).send({ errorMessage: 'Unauthorized' });
      return;
    }

    const track = await db
      .selectFrom('track')
      .where('id', '=', trackId)
      .where('project_id', '=', projectId)
      .selectAll()
      .executeTakeFirst();

    if (track === undefined) {
      res.status(404).send({ errorMessage: 'Track not found' });
      return;
    }

    res.send({ track: track });
  }
);

app.get(
  '/projects/:projectId/tracks/:trackId/cues',
  async (req, res: Response<Gateway.GetCuesResponseBody | Gateway.ErrorResponseBody>) => {
    const { projectId, trackId } = req.params;

    const { permission } = await checkProjectPermission(projectId, res.locals.uid);
    if (permission === 'doesnotexist') {
      res.status(404).send({ errorMessage: 'Project not found' });
      return;
    }
    if (permission === 'unauthorized') {
      res.status(401).send({ errorMessage: 'Unauthorized' });
      return;
    }

    const cues: Irisub.Cue[] = await db
      .selectFrom('cue')
      .where('project_id', '=', projectId)
      .where('track_id', '=', trackId)
      .selectAll()
      .execute();

    res.send({ cues: cues });
  }
);

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

  const insertResult = await db
    .insertInto('project')
    .values({ ...newProject, owner_user_id: res.locals.uid })
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        title: eb.ref('excluded.title'),
      }))
    )
    .execute();
  res.locals.modified_rows = insertResult.reduce(
    (total, cur) => total + Number(cur.numInsertedOrUpdatedRows),
    0
  );

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

  res.send({ project: newProject });
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

  const insertResult = await db
    .insertInto('track')
    .values({ ...newTrack, project_id: projectId })
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        name: eb.ref('excluded.name'),
        language: eb.ref('excluded.language'),
      }))
    )
    .execute();
  res.locals.modified_rows = insertResult.reduce(
    (total, cur) => total + Number(cur.numInsertedOrUpdatedRows),
    0
  );

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

  res.send({ track: newTrack });
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
  const insertResult = await db
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
  res.locals.modified_rows = insertResult.reduce(
    (total, cur) => total + Number(cur.numInsertedOrUpdatedRows),
    0
  );

  if (clients[projectId]) {
    clients[projectId].forEach((client) => {
      if (client.id !== eventSourceClientId) {
        console.log(`Sending message to client ${client.id} (uid ${client.uid})`);
        const gwEvent: Gateway.UpsertCuesEvent = {
          cues: req.body.cues,
          trackId: trackId,
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
