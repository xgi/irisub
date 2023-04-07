import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";

export async function handleSessionCookieAuth(req: Request, res: Response, next: NextFunction) {
  const sessionCookie = req.cookies.session || "";

  const valid = await admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      console.log(`Validated session cookie for ${decodedClaims.uid}`);
      res.locals.uid = decodedClaims.uid;
      return true;
    })
    .catch((err) => {
      return false;
    });

  if (valid) return next();
  res.status(401).send("Unauthorized");
}
