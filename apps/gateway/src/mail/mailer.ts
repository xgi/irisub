import { logger } from '../logger';
import sgMail from '@sendgrid/mail';

const sgApiKey = process.env.SENDGRID_API_KEY;
if (sgApiKey) {
  sgMail.setApiKey(sgApiKey);
} else {
  logger.warn('SENDGRID_API_KEY not available; emails will not be sent');
}

export const sendUserInvitationEmail = (
  toEmail: string,
  senderEmail: string,
  teamName: string,
  invitationId: string
) => {
  const msg = {
    to: toEmail,
    from: 'support@irisub.com',
    subject: `${senderEmail} has invited you to join ${teamName} on Irisub`,
    html: `Code: ${invitationId}`,
  };

  return sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};
