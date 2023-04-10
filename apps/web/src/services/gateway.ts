import { Gateway, Irisub } from '@irisub/shared';

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
