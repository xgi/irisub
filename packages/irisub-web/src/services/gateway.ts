import { Gateway, Irisub } from "irisub-common";

const BASE_URL = "//localhost:3003";

type EventHandler = (event: Gateway.Event) => void;

class GatewayConn {
  eventSource: EventSource | null = null;
  eventSourceClientId: string | null = null;

  constructor() {}

  connectEventSource(projectId: string) {
    this.disconnectEventSource();

    return new Promise<void>((res, rej) => {
      this.eventSource = new EventSource(`${BASE_URL}/events?projectId=${projectId}`, {
        // this.eventSource = new EventSource(`//localhost:3003/events`, {
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

  upsertCues(projectId: string, trackId: string, cues: Irisub.Event[]) {
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
