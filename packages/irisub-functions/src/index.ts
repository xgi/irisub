import express from "express";
import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { appleFunc } from "irisub-common/apple";

admin.initializeApp(functions.config().firebase);

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

export const processSignUp = functions.auth.user().onCreate((user) => {
  console.log(user);
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": user.uid,
    },
  };

  return admin
    .auth()
    .setCustomUserClaims(user.uid, customClaims)
    .catch((error) => {
      console.log(error);
    });
});
