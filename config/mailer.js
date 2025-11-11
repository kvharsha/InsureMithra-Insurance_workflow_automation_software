const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null; // Mailer not configured
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });
  return cachedTransporter;
}

async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    // Not configured; in dev, log and no-op
    console.warn('[mailer] Transporter not configured; skipping email send');
    return { accepted: [], rejected: [to], skipped: true };
  }
  const from = process.env.EMAIL_FROM || 'noreply@insuremithra.com';
  return transporter.sendMail({ from, to, subject, html, text });
}

module.exports = { getTransporter, sendEmail };

module.exports = require('../config/mailer');
