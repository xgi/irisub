import admin, { ServiceAccount } from "firebase-admin";

const {
  GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
  GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
} = process.env;

let serviceAccount: ServiceAccount | undefined;
if (
  GOOGLE_SERVICE_ACCOUNT_PROJECT_ID &&
  GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL &&
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
) {
  serviceAccount = {
    projectId: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  };
}

export const initializeFirebase = () => {
  admin.initializeApp(
    serviceAccount
      ? {
          credential: admin.credential.cert(serviceAccount),
        }
      : undefined,
  );
};
