const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://asmfw-8.onrender.com/auth/callback'
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

console.log('🔗 Mở link này và login Gmail:', 
  oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES })
);
