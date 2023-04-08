import { Gateway, Irisub } from "irisub-common";

const BASE_URL = "//localhost:3123";

type EventHandler = (event: Gateway.Event) => void;

class GatewayConn {
  eventSource: EventSource | null = null;
  eventSourceClientId: string | null = null;

  constructor() {}

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
          (this.eventSourceClientId = (gwEvent as Gateway.IdentifyEventSourceClientEvent).clientId),
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
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
      body: JSON.stringify({
        idToken: idToken,
      }),
    });
  }

  getProjects(): Promise<Irisub.Project[]> {
    return fetch(`${BASE_URL}/projects`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
    })
      .then((res) => res.json())
      .then((data) => data.projects);
  }

  getTracks(projectId: string): Promise<Irisub.Track[]> {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
    })
      .then((res) => res.json())
      .then((data) => data.tracks);
  }

  getCues(projectId: string, trackId: string): Promise<Irisub.Cue[]> {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${trackId}/cues`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
    })
      .then((res) => res.json())
      .then((data) => data.cues);
  }

  getProject(projectId: string): Promise<Irisub.Project> {
    return fetch(`${BASE_URL}/projects/${projectId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
    })
      .then((res) => res.json())
      .then((data) => data.project);
  }

  getTrack(projectId: string, trackId: string): Promise<Irisub.Track> {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${trackId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
    })
      .then((res) => res.json())
      .then((data) => data.track);
  }

  upsertProject(project: Irisub.Project) {
    return fetch(`${BASE_URL}/projects/${project.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
      body: JSON.stringify({
        project: project,
      }),
    });
  }

  upsertTrack(projectId: string, track: Irisub.Track) {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${track.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
      body: JSON.stringify({
        track: track,
      }),
    });
  }

  upsertCues(projectId: string, trackId: string, cues: Irisub.Cue[]) {
    return fetch(`${BASE_URL}/projects/${projectId}/tracks/${trackId}/cues`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "gateway-event-source-client-id": this.eventSourceClientId || "",
      },
      body: JSON.stringify({
        cues: cues,
      }),
    });
  }
}

export const gateway = new GatewayConn();
