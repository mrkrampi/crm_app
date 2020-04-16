import * as nodemailer from 'nodemailer';
import { confirmTemplate } from './templates/EmailTemplates';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'praydernick@gmail.com',
    pass: 'nickprayder4564'
  }
});

export function sendMail(inviteId: string, email: string) {
  const mailOptions = {
    from: 'InventorSoft CRM',
    to: email,
    subject: 'Confirm your registration',
    html: confirmTemplate(inviteId)
  };
  return transporter.sendMail(mailOptions);
}
