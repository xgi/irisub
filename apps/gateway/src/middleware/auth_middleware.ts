import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import { logger } from '../logger';

export async function handleSessionCookieAuth(req: Request, res: Response, next: NextFunction) {
  const sessionCookie = req.cookies.session || '';

  const valid = await admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      res.locals.uid = decodedClaims.uid;
      return true;
    })
    .catch((err) => {
      logger.error(`Failed to validate session cookie: ${sessionCookie}`, err);
      return false;
    });

  if (valid) return next();
  res.status(401).send('Unauthorized');
}
