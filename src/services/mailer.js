import mail from '@sendgrid/mail';
import { SENGRID_API_KEY } from '../constants';

mail.setApiKey(SENGRID_API_KEY);

const mailer = ({
  to = 'admin@fsstv.com',
  from = 'olatoye@consumatech.co.za',
  subject = 'fsstv',
  html = '<strong>fsstv team</strong>',
  bcc,
  cc,
  text,
}) => mail.send({ to, bcc, cc, from, subject, text, html });

export default mailer;
