import express from "express";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import url from "url";
import admin from "firebase-admin";

const app = express();
const port = 3000;

// app.use(express.static("public"));

admin.initializeApp();

const expressServer = app.listen(port, () => {
  console.log("Express server listening at http://localhost:" + port);
});

const wss = new WebSocket.Server({ server: expressServer });

var wsClients: { [token: string]: WebSocket } = {};

wss.on("connection", (ws, req) => {
  console.log("Processing websocket connection...");

  var token = url.parse(req.url as string, true).query.token as string;

  var wsUserId = "";

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      console.log("jwt success");
      wsClients[token] = ws;
      wsUserId = decodedToken.uid;
    })
    .catch((err) => {
      console.log(`wt verification failed, error: ${err}`);
      ws.close();
    });

  // TODO: handle token reverification
  // TODO: handle closed clients

  ws.on("message", (data) => {
    console.log(`Received message from user ${wsUserId}: ${data}`);

    // for (const [token, client] of Object.entries(wsClients)) {
    //   client.send("hello!");
    //   jwt.verify(token, jwtSecret, (err, decoded) => {
    //     if (err) {
    //       client.send("Error: Your token is no longer valid. Please reauthenticate.");
    //       client.close();
    //     } else {
    //       client.send(wsUserId + ": " + data);
    //     }
    //   });
    // }
  });
});
