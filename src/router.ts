import path from 'path';
import { Router } from 'express';
import fetch from 'node-fetch';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from './constants/env';
import { GITHUB_LOGIN_REDIRECT, GITHUB_ACCESS_TOKEN } from './constants/endpoints';

const router = Router();

router.get('/', (_, res) => res.sendFile(path.join(__dirname, '../src/static/login.html')));

router.get('/github-login', (_, res) => {
  res.redirect(`${GITHUB_LOGIN_REDIRECT}?client_id=${GITHUB_CLIENT_ID}`);
});

router.get('/github-code', async (req) => {
  const { query } = req;
  const codeForAccessToken: String = query.code;
  const response = await fetch(
    GITHUB_ACCESS_TOKEN,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: codeForAccessToken,
      }),
    },
  );

  const result = await response.json();
  const accessToken: String = result.access_token;
});

export default router;
