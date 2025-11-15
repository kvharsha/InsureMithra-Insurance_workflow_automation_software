const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    // No SMTP configured — return null and let sendEmail decide fallback behavior
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

// sendEmail will attempt to create an Ethereal test account in dev when no SMTP is configured.
async function sendEmail({ to, subject, html, text }) {
  let transporter = getTransporter();

  if (!transporter) {
    // During tests we keep the previous no-op behavior to avoid network calls
    if (process.env.NODE_ENV === 'test') {
      console.warn('[mailer] Transporter not configured; skipping email send (test env)');
      return { accepted: [], rejected: [to], skipped: true };
    }

    // Create an Ethereal test account for development so emails can be previewed
    console.warn('[mailer] No SMTP configuration found — creating Ethereal test account for dev');
    // createTestAccount is async
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    cachedTransporter = transporter;
    console.info('[mailer] Ethereal account created. User:', testAccount.user);
  }

  const from = process.env.EMAIL_FROM || 'noreply@insuremithra.com';
  const info = await transporter.sendMail({ from, to, subject, html, text });

  // If this is an Ethereal message, log the preview URL for developers
  try {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log('[mailer] Preview URL:', previewUrl);
  } catch (e) {
    // ignore
  }

  return info;
}

module.exports = { getTransporter, sendEmail };
