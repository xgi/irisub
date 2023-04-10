import { Gateway, Irisub } from '@irisub/shared';
import { nanoid } from 'nanoid';
import { randomProjectName } from '../util/random';

const BASE_URL = '//localhost:3123';

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
      name: 'English',
      language: null,
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

  getProjects(): Promise<{ owned: Irisub.Project[]; joined: Irisub.Project[] }> {
    return fetch(`${BASE_URL}/projects`, {
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

  getTracks(projectId: string): Promise<Irisub.Track[]> {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks`, {
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
      .then((data) => data.tracks);
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
