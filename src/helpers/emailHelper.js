import { BACKEND_URL } from '../constants';
import mailer from '../services/mailer';

export const signupEmail = (email, password, link) => `
<p>You can login via this <a href="${link}">link</a> with the following credentials:</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Password:</strong> ${password}</p>
`;

export const verifyEmail = (token) => `
<p>Please verify your account</p>
<a href="${BACKEND_URL}/api/users/verify/${token}"> Verify Email </a>
`;

export const resetEmail = (resetKey, resetUrl) => `
<p>Follow this link to reset your password</p>
 <a href="${resetUrl}/${resetKey}">Reset password</a>
 <p>If you are having trouble accessing the link please copy it and paste it to your browser</p>
 <p>${resetUrl}/${resetKey}</p>
`;

export const resetSuccessMail = () => `
<p>Your password was reset successfully</p>
<p>You can now use your new password to log in</p>
`;

export const eventReminderEmail = (fullName, event, reminder, truck, eventDate) => `
<p>Hello ${fullName}, you requested to be reminded! <strong>${reminder.replace(/_/g," ")} </strong> about the event <strong> ${event}. </strong></p>
<p>That will happen on <strong> ${eventDate}. </strong> For the truck <strong> ${truck}. </strong></p>
`;

export default (to, subject, message, htmlFormatted) => {
  let html = '';
  if (message) html = ` <p>${message} </p>`;
  mailer({ to, subject, html: html || htmlFormatted });
};
