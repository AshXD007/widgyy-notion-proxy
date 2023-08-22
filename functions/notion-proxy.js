import fetch from "node-fetch";

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }
  const responseHeaders = {
    'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend's domain in production
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const { b64EncodedKey, authCode, redirectUri } = JSON.parse(event.body);

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
    return {
      statusCode: response.status,
      headers:responseHeaders,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers:responseHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
