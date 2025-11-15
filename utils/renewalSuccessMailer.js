const path = require('path');
const fs = require('fs').promises;
// require the mailer module lazily so tests can spy on its methods
const mailer = require('../config/mailer');

async function sendRenewalSuccessEmail(userEmail, userName, policyNumber, newExpiryDate, transactionId, amount, currency) {
  try {
    const templatePath = path.join(__dirname, '../templates/renewalSuccessEmail.html');
    let html = '';
    try {
      html = await fs.readFile(templatePath, 'utf8');
    } catch (err) {
      // fallback simple html
      html = `<h2>Renewal Successful</h2><p>Dear ${userName},</p><p>Your policy ${policyNumber} has been renewed. New expiry: ${newExpiryDate}.</p>`;
    }

    html = html.replace(/{{userName}}/g, userName)
      .replace(/{{policyNumber}}/g, policyNumber)
      .replace(/{{newExpiryDate}}/g, newExpiryDate)
      .replace(/{{transactionId}}/g, transactionId || '')
      .replace(/{{amount}}/g, `${currency || ''} ${amount || ''}`);

    await mailer.sendEmail({
      to: userEmail,
      subject: 'Your Policy Renewal is Successful',
      html,
      text: `Dear ${userName}, your policy ${policyNumber} has been renewed. New expiry: ${newExpiryDate}`
    });

    return true;
  } catch (error) {
    // don't throw - mail failures should not block success flow
    console.error('renewalSuccessMailer error:', error);
    return false;
  }
}

module.exports = { sendRenewalSuccessEmail };
