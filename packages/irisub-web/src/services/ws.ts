export let ws: WebSocket;

export const openWsConnection = (jwtAuth: any) => {
  if (ws) {
    ws.close();
  }

  console.log("Opening websocket connection...");

  ws = new WebSocket("ws://localhost:3000/?token=asd" + jwtAuth);

  ws.onopen = (event) => {
    console.log("WebSocket connection established.");
    ws.send("Hello, world!");
  };

  ws.onmessage = (event) => {
    console.log("WebSocket message received: ", event.data);
  };

  ws.onerror = (event) => {
    console.log("WebSocket error received: ", event);
  };

  ws.onclose = (event) => {
    console.log("WebSocket connection closed.");
  };
};

export const sendWebsocketMessage = () => {
  console.log("sending websocket message");
  ws.send("this is a message");
};
