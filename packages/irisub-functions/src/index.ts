import express from "express";
import * as functions from "firebase-functions";
import { appleFunc } from "irisub-common/apple";

const app = express();

app.get("*", (req, res) => {
  const value = appleFunc();

  res.send({
    thing: value,
    other: "helloasd",
    time: Date.now(),
    origin: req.hostname,
  });
});

export const server = functions.https.onRequest(app);
