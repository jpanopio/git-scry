import fetch from 'node-fetch';
import { Request, Response } from 'express';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../constants/env';
import { GITHUB_LOGIN_REDIRECT, GITHUB_ACCESS_TOKEN } from '../../constants/endpoints';

export const loginRedirect = (_: Request, res: Response) => {
  res.redirect(`${GITHUB_LOGIN_REDIRECT}?client_id=${GITHUB_CLIENT_ID}`);
};

export const getAccessToken = async (req: Request) => {
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

  return accessToken;
};
