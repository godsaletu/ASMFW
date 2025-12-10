const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://asmfw-8.onrender.com/auth/callback'
);

const code = 'PASTE_CODE_VỪA_LẤY';

async function main() {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log('🔑 Refresh Token:', tokens.refresh_token);
}

main().catch(console.error);
