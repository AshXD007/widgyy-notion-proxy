
import cors from 'cors'
import { express } from 'express';
import serverless from 'serverless-http';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.post('/.netlify/functions/notion-proxy', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { b64EncodedKey, authCode, redirectUri } = req.body;

  const baseUrl = 'https://api.notion.com/v1/oauth/token';

  const authHeaders = {
    'Authorization': `Basic ${b64EncodedKey}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  };

  const authData = new URLSearchParams({
    'grant_type': 'authorization_code',
    'code': authCode,
    'redirect_uri': redirectUri,
  });

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: authHeaders,
      body: authData,
    });

    const data = await response.json();

    const responseHeaders = {
      'Access-Control-Allow-Origin': '*', // Replace '*' with your allowed origin(s)
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    res
      .status(response.status)
      .set(responseHeaders)
      .json(data);
  } catch (error) {
    console.error('Error:', error);

    const responseHeaders = {
      'Access-Control-Allow-Origin': '*', // Replace '*' with your allowed origin(s)
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    res
      .status(500)
      .set(responseHeaders)
      .json({ error: 'Internal server error' });
  }
});

module.exports.handler = serverless(app);
