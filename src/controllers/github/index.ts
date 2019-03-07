import fetch from 'node-fetch';
import { Request, Response } from 'express';
import qs from 'qs';
import logger from '../../logger';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../constants/env';
import { GITHUB_LOGIN_REDIRECT, GITHUB_ACCESS_TOKEN } from '../../constants/endpoints';

export const loginRedirect = (_: Request, res: Response) => {
  logger.info('Redirecting to GitHub login');

  const params = qs.stringify({
    client_id: GITHUB_CLIENT_ID,
    scope: 'user:email,read:org',
  });

  res.redirect(`${GITHUB_LOGIN_REDIRECT}?${params}`);
};

export const getAccessToken = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const codeForAccessToken: String = query.code;

    if (!codeForAccessToken) {
      throw new Error(`Unable to retrieve access token with code: ${codeForAccessToken}`);
    }

    logger.info(`Requesting access token from ${GITHUB_ACCESS_TOKEN}`);

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

    if (!accessToken) {
      throw new Error('Empty access token returned from GitHub');
    }

    logger.info('Received access token');

    req.session.githubAccessToken = accessToken;
    res.redirect('/');
  } catch (err) {
    const errorMessage = err.message || 'Unable to retrieve access token';

    logger.error(errorMessage);

    res.status(500).send({ error: errorMessage });
  }
};
