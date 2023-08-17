import { Gateway, Irisub } from '@irisub/shared';
import { nanoid } from 'nanoid';
import { randomProjectName } from '../util/random';

const BASE_URL = '//gateway.irisub.com';

type EventHandler = (event: Gateway.Event) => void;

class GatewayResponseError extends Error {
  code: number;

  constructor(msg: string, code: number) {
    super(msg);
    Object.setPrototypeOf(this, GatewayResponseError.prototype);

    this.code = code;
  }
}

class GatewayConn {
  eventSource: EventSource | null = null;
  eventSourceClientId: string | null = null;

  connectEventSource(projectId: string) {
    this.disconnectEventSource();

    return new Promise<void>((res, rej) => {
      this.eventSource = new EventSource(`${BASE_URL}/events?projectId=${projectId}`, {
        withCredentials: true,
      });

      this.eventSource.onopen = () => res();
    }).then(() => {
      this.subscribe(
        Gateway.EventName.IDENTIFY_EVENT_SOURCE_CLIENT,
        (gwEvent) =>
          (this.eventSourceClientId = (gwEvent as Gateway.IdentifyEventSourceClientEvent).clientId)
      );
    });
  }

  disconnectEventSource() {
    if (this.eventSource) this.eventSource.close();
    this.eventSource = null;
  }

  subscribe(eventName: Gateway.EventName, handler: EventHandler): () => void {
    const listener = (msgEvent: MessageEvent) => {
      handler(JSON.parse(msgEvent.data));
    };

    this.eventSource?.addEventListener(eventName, listener);
    return () => {
      this.eventSource?.removeEventListener(eventName, listener);
    };
  }

  sessionLogin(idToken: string) {
    return fetch(`${BASE_URL}/sessionLogin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
      body: JSON.stringify({
        idToken: idToken,
      }),
    });
  }

  async setupNewProject(): Promise<{ project: Irisub.Project; track: Irisub.Track }> {
    console.log('Creating new project...');

    const newProject: Irisub.Project = {
      id: nanoid(),
      title: randomProjectName(),
    };
    await gateway.upsertProject(newProject);

    const newTrack: Irisub.Track = {
      id: nanoid(),
      name: 'Unnamed Track',
      languageCode: 'en',
    };
    await gateway.upsertTrack(newProject.id, newTrack);

    const introCueTextList = [
      'Welcome to Irisub! This is the first subtitle.',
      'To get started, click Select Video to choose a file or video from YouTube/Vimeo.',
      'You can resize the panels on this page by clicking and dragging the dividers.',
      'Split text into multiple lines with Shift+Enter.\nThis is the second line.',
      'This session is temporary by default. Click Save Workspace in the top right to keep your work.',
    ];
    const newCueList: Irisub.Cue[] = introCueTextList.map((text, index) => ({
      id: nanoid(),
      text: text,
      start_ms: index * 3000,
      end_ms: (index + 1) * 3000,
    }));
    await gateway.upsertCues(newProject.id, newTrack.id, newCueList);

    return { project: newProject, track: newTrack };
  }

  async sendInvitations(
    teamId: string,
    invitees: { email: string; role: 'owner' | 'editor' }[]
  ): Promise<void> {
    const resp = await fetch(`${BASE_URL}/sendInvitations`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamId: teamId,
        invitees: invitees,
      }),
    });

    if (!resp.ok) throw new GatewayResponseError(resp.statusText, resp.status);
  }

  async acceptInvitation(invitationId: string): Promise<void> {
    const resp = await fetch(`${BASE_URL}/invitations/${invitationId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accepted: true,
      }),
    });

    if (!resp.ok) throw new GatewayResponseError(resp.statusText, resp.status);
  }

  async getProjects(): Promise<Gateway.GetProjectsResponseBody> {
    const resp = await fetch(`${BASE_URL}/projects`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) throw new GatewayResponseError(resp.statusText, resp.status);
    return resp.json();
  }

  async getTeams(): Promise<Gateway.GetTeamsResponseBody> {
    const resp = await fetch(`${BASE_URL}/teams`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) throw new GatewayResponseError(resp.statusText, resp.status);
    return resp.json();
  }

  getTracks(projectId: string): Promise<Gateway.GetTracksResponseBody> {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
    }).then((res) => {
      if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
      return res.json();
    });
  }

  getCues(projectId: string, trackId: string): Promise<Irisub.Cue[]> {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${trackId}/cues`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
    })
      .then((res) => {
        if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
        return res.json();
      })
      .then((data) => data.cues);
  }

  getProject(projectId: string): Promise<Irisub.Project> {
    return fetch(`${BASE_URL}/projects/${projectId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
    })
      .then((res) => {
        if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
        return res.json();
      })
      .then((data) => data.project);
  }

  getTrack(projectId: string, trackId: string): Promise<Irisub.Track> {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${trackId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
    })
      .then((res) => {
        if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
        return res.json();
      })
      .then((data) => data.track);
  }

  getInvitation(invitationId: string): Promise<Gateway.GetInvitationResponseBody> {
    return fetch(`${BASE_URL}/invitations/${invitationId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
      return res.json();
    });
  }

  upsertTeam(team: Irisub.Team) {
    return fetch(`${BASE_URL}/teams/${team.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        team: team,
      }),
    }).then((res) => {
      if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
      return res.json();
    });
  }

  upsertProject(project: Irisub.Project) {
    return fetch(`${BASE_URL}/projects/${project.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
      body: JSON.stringify({
        project: project,
      }),
    }).then((res) => {
      if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
      return res.json();
    });
  }

  upsertTrack(projectId: string, track: Irisub.Track) {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${track.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
      body: JSON.stringify({
        track: track,
      }),
    }).then((res) => {
      if (!res.ok) throw new GatewayResponseError(res.statusText, res.status);
      return res.json();
    });
  }

  upsertCues(projectId: string, trackId: string, cues: Irisub.Cue[]) {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${trackId}/cues`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'gateway-event-source-client-id': this.eventSourceClientId || '',
      },
      body: JSON.stringify({
        cues: cues,
      }),
    });
  }
}

export const gateway = new GatewayConn();
