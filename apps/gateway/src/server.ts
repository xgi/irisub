import express, { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import { handleSessionCookieAuth } from './middleware/auth_middleware';
import { Gateway, Irisub } from '@irisub/shared';
import { db } from './db/database.server';
import { initializeFirebase } from './firebase';
import { InvitationTable, ProjectTable, TeamTable } from './db/tables';
import { InsertResult, Selectable } from 'kysely';
import { logger } from './logger';
import { sendUserInvitationEmail } from './mail/mailer';

const app = express();
const port = process.env.GATEWAY_PORT;

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
      path: req.route?.path || '',
      url: decodeURI(req.url),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      duration: now - start_time,
      modifiedRows: res.locals.modified_rows || 0,
    };

    logger.info(JSON.stringify(logObj));
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
        logger.error(error);
        res.status(401).send('Unauthorized');
      }
    );
});

/** Helpers */

type ProjectPermission = 'owner' | 'editor' | 'doesnotexist' | 'unauthorized';

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
  if (project.creator_user_id === userId) return { permission: 'owner', project: project };

  if (project.team_id) {
    const collaborator = await db
      .selectFrom('collaborator')
      .where('team_id', '=', project.team_id)
      .where('user_id', '=', userId)
      .select('role')
      .executeTakeFirst();
    if (collaborator !== undefined) return { permission: collaborator.role, project: project };
  }

  return { permission: 'unauthorized', project: project };
};

const checkInvitation = async (
  invitationId: string,
  res: Response
): Promise<{
  invitation?: Selectable<InvitationTable>;
  team?: Selectable<TeamTable>;
  success: boolean;
}> => {
  const invitation = await db
    .selectFrom('invitation')
    .where('id', '=', invitationId)
    .selectAll()
    .executeTakeFirst();

  if (!invitation) {
    res.status(404).send({ errorMessage: 'Invitation not found' });
    return { success: false };
  }

  if (invitation.invitee_email !== res.locals.user_email) {
    res.status(401).send({ errorMessage: 'Unauthorized' });
    return { invitation, success: false };
  }

  if (invitation.accepted) {
    res.status(429).send({ errorMessage: 'Already accepted' });
    return { invitation, success: false };
  }

  const now = new Date().getTime();
  const created = new Date(invitation.created_at).getTime();
  if (now - created > 1000 * 60 * 60 * 24) {
    res.status(410).send({ errorMessage: 'Expired' });
    return { invitation, success: false };
  }

  const team = await db
    .selectFrom('team')
    .where('id', '=', invitation.team_id)
    .selectAll()
    .executeTakeFirst();

  if (!team) {
    res.status(404).send({ errorMessage: 'Team not found' });
    return { invitation, team, success: false };
  }

  return { invitation, team, success: true };
};

const sumInsertedOrUpdatedRows = (insertResults: InsertResult[]) => {
  return insertResults.reduce((total, cur) => total + Number(cur.numInsertedOrUpdatedRows), 0);
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

const broadcastEvent = (
  eventName: Gateway.EventName,
  data: Gateway.Event,
  projectId: string,
  ignoreClientId = ''
) => {
  if (clients[projectId]) {
    clients[projectId].forEach((client) => {
      if (!ignoreClientId || client.id !== ignoreClientId) {
        sendGatewayEvent(eventName, data, client);
      }
    });
  }
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
    logger.info(`${client.id} connection closed`);
    clients[projectId] = clients[projectId].filter((c) => c.id !== client.id);
  });
});

/** REST API */

app.get(
  '/projects',
  async (req, res: Response<Gateway.GetProjectsResponseBody | Gateway.ErrorResponseBody>) => {
    const collaborators = await db
      .selectFrom('collaborator')
      .where('user_id', '=', res.locals.uid)
      .select('team_id')
      .execute();

    const joined: { teamName: string; projects: ProjectTable[] }[] = [];
    await Promise.all(
      collaborators.map(async (collaborator) => {
        const team = await db
          .selectFrom('team')
          .where('id', '=', collaborator.team_id)
          .selectAll()
          .executeTakeFirstOrThrow();
        const team_projects = await db
          .selectFrom('project')
          .where('team_id', '=', collaborator.team_id)
          .selectAll()
          .execute();
        joined.push({ teamName: team.name, projects: team_projects });
      })
    );

    const owned = await db
      .selectFrom('project')
      .where('creator_user_id', '=', res.locals.uid)
      .selectAll()
      .execute();

    res.send({ owned: owned, teams: joined });
  }
);

app.get(
  '/teams',
  async (req, res: Response<Gateway.GetTeamsResponseBody | Gateway.ErrorResponseBody>) => {
    const team_ids = (
      await db
        .selectFrom('collaborator')
        .where('user_id', '=', res.locals.uid)
        .select('team_id')
        .execute()
    ).map((team) => team.team_id);

    const result: Gateway.GetTeamsResponseBody['teams'] = [];

    await Promise.all(
      team_ids.map(async (team_id) => {
        const team = await db
          .selectFrom('team')
          .where('id', '=', team_id)
          .selectAll()
          .executeTakeFirstOrThrow();

        const collaborators = await db
          .selectFrom('collaborator')
          .where('team_id', '=', team_id)
          .selectAll()
          .execute();

        result.push({
          id: team.id,
          name: team.name,
          members: collaborators.map((collaborator) => ({
            id: collaborator.user_id,
            email: collaborator.email,
            role: collaborator.role,
          })),
          created_at: team.created_at,
          updated_at: team.updated_at,
        });
      })
    );

    res.send({ teams: result });
  }
);

app.get(
  '/invitations/:invitationId',
  async (req, res: Response<Gateway.GetInvitationResponseBody | Gateway.ErrorResponseBody>) => {
    const { invitationId } = req.params;

    const result = await checkInvitation(invitationId, res);
    if (result.success) {
      res.send({ invitation: result.invitation, teamName: result.team.name });
    }
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

app.post('/sendInvitations', async (req, res) => {
  const { teamId, invitees } = req.body;

  if (!invitees || invitees.length === 0 || invitees.length > 10) {
    res.status(401).send('Invalid number of invitees');
    return;
  }

  const team = await db.selectFrom('team').where('id', '=', teamId).selectAll().executeTakeFirst();
  if (!team) {
    res.status(404).send('Not Found');
    return;
  }

  const collaborator = await db
    .selectFrom('collaborator')
    .where('team_id', '=', teamId)
    .where('user_id', '=', res.locals.uid)
    .select('role')
    .executeTakeFirst();

  if (!collaborator || collaborator.role !== 'owner') {
    res.status(401).send('Unauthorized');
    return;
  }

  const invitations = invitees.map((invitee) => ({
    id: nanoid(),
    sender_user_id: res.locals.uid,
    invitee_email: invitee.email,
    invitee_role: invitee.role,
    team_id: teamId,
  }));

  const insertResult = await db.insertInto('invitation').values(invitations).execute();
  res.locals.modified_rows = sumInsertedOrUpdatedRows(insertResult);

  await Promise.all(
    invitations.map(async (invitation) => {
      await sendUserInvitationEmail(
        invitation.invitee_email,
        res.locals.user_email,
        team.name,
        invitation.id
      );
    })
  );

  res.send({ invitations: invitations });
});

app.post('/invitations/:invitationId', async (req, res) => {
  const { invitationId } = req.params;
  const { accepted } = req.body;

  if (!accepted) {
    res.status(401).send('Invalid input, only use this endpoint with accepted=true in body');
    return;
  }

  const result = await checkInvitation(invitationId, res);
  if (!result.success) return;

  const insertInvitationResult = await db
    .insertInto('invitation')
    .values({ ...result.invitation, accepted: true })
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        accepted: eb.ref('excluded.accepted'),
      }))
    )
    .execute();
  res.locals.modified_rows = sumInsertedOrUpdatedRows(insertInvitationResult);

  const insertCollaboratorResult = await db
    .insertInto('collaborator')
    .values({
      user_id: res.locals.uid,
      team_id: result.team.id,
      email: res.locals.user_email,
      role: result.invitation.invitee_role,
    })
    .execute();
  res.locals.modified_rows += sumInsertedOrUpdatedRows(insertCollaboratorResult);

  res.end();
});

app.post('/projects/:projectId', async (req, res) => {
  const eventSourceClientId = req.headers['gateway-event-source-client-id'] as string;
  const { projectId } = req.params;

  // TODO: validate req.body.project keys match Irisub.Project
  const newProject: Irisub.Project = req.body.project;
  if (newProject.id !== projectId) {
    res.status(400).send('Project ID in body does not match URL parameter');
    return;
  }

  const { permission, project } = await checkProjectPermission(projectId, res.locals.uid);
  if (permission === 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }

  if (project && project.team_id !== newProject.team_id && permission !== 'owner') {
    res.status(401).send('Unauthorized');
    return;
  }

  const newValues = { ...newProject, creator_user_id: res.locals.uid };
  const insertResult = await db
    .insertInto('project')
    .values(newValues)
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        title: eb.ref('excluded.title'),
        team_id: eb.ref('excluded.team_id'),
      }))
    )
    .execute();
  res.locals.modified_rows = sumInsertedOrUpdatedRows(insertResult);

  const gwEvent: Gateway.UpsertProjectEvent = {
    project: newProject,
  };
  broadcastEvent(Gateway.EventName.UPSERT_PROJECT, gwEvent, projectId, eventSourceClientId);

  res.send({ project: newProject });
  res.end();
});

app.post('/teams/:teamId', async (req, res) => {
  const { teamId } = req.params;

  const newTeam: Irisub.Team = req.body.team;
  if (newTeam.id !== teamId) {
    res.status(400).send('Team ID in body does not match URL parameter');
    return;
  }

  if (!res.locals.user_email) {
    res.status(400).send('User does not have associated email address');
    return;
  }

  const insertTeamResult = await db
    .insertInto('team')
    .values({ ...newTeam })
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        name: eb.ref('excluded.name'),
      }))
    )
    .execute();
  res.locals.modified_rows = sumInsertedOrUpdatedRows(insertTeamResult);

  const insertCollaboratorResult = await db
    .insertInto('collaborator')
    .values({
      user_id: res.locals.uid,
      team_id: teamId,
      email: res.locals.user_email,
      role: 'owner',
    })
    .execute();
  res.locals.modified_rows += sumInsertedOrUpdatedRows(insertCollaboratorResult);

  res.send({ team: newTeam });
  res.end();
});

app.post('/projects/:projectId/tracks/:trackId', async (req, res) => {
  const eventSourceClientId = req.headers['gateway-event-source-client-id'] as string;
  const { projectId, trackId } = req.params;

  // TODO: validate req.body.track keys match Irisub.Track
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
        languageCode: eb.ref('excluded.languageCode'),
      }))
    )
    .execute();
  res.locals.modified_rows = sumInsertedOrUpdatedRows(insertResult);

  const gwEvent: Gateway.UpsertTrackEvent = {
    track: newTrack,
  };
  broadcastEvent(Gateway.EventName.UPSERT_TRACK, gwEvent, projectId, eventSourceClientId);

  res.send({ track: newTrack });
  res.end();
});

app.post('/projects/:projectId/tracks/:trackId/cues', async (req, res) => {
  const eventSourceClientId = req.headers['gateway-event-source-client-id'] as string;
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
  res.locals.modified_rows = sumInsertedOrUpdatedRows(insertResult);

  const gwEvent: Gateway.UpsertCuesEvent = {
    cues: req.body.cues,
    trackId: trackId,
  };
  broadcastEvent(Gateway.EventName.UPSERT_CUES, gwEvent, projectId, eventSourceClientId);

  res.end();
});

export const startServer = () => {
  initializeFirebase();
  return app.listen(port, () => {
    logger.info(`Express server listening at http://localhost:${port}`);
  });
};
