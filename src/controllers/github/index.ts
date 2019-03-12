import fetch from 'node-fetch';
import { Request, Response } from 'express';
import qs from 'qs';
import logger from '../../logger';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../constants/env';
import {
  GITHUB_LOGIN_REDIRECT,
  GITHUB_ACCESS_TOKEN,
  GITHUB_ORGANIZATIONS,
  GITHUB_USER,
} from '../../constants/endpoints';

export const loginRedirect = (req: Request, res: Response) => {
  const { query } = req;

  req.session.gitScry = { redirect: query.redirect };

  logger.info('Redirecting to GitHub login');

  const params = qs.stringify({
    client_id: GITHUB_CLIENT_ID,
    scope: 'user:email,read:org,repo',
  });

  res.redirect(`${GITHUB_LOGIN_REDIRECT}?${params}`);
};

export const getSessionStatus = (req: Request, res: Response) => {
  const gitScry = req.session.gitScry;

  res.send({
    "loggedIn": gitScry != null,
  });
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
    const accessToken: string = result.access_token;
    const appScope: string = result.scope;

    if (!accessToken) {
      throw new Error('Empty access token returned from GitHub');
    }

    logger.info('Received access token');

    req.session.gitScry.githubAccessToken = accessToken;
    req.session.gitScry.appScope = appScope;

    const uiRedirect = req.session.gitScry.redirect;

    res.redirect(uiRedirect);
  } catch (err) {
    const errorMessage = err.message || 'Unable to retrieve access token';

    logger.error(errorMessage);

    res.status(500).send({ error: errorMessage });
  }
};

export const getPullRequests = async (req: Request, res: Response) => {
  try {
    const gitScry = req.session.gitScry;

    if (!gitScry) {
      throw new Error('Session expired');
    }

    const githubAccessToken: string = gitScry.githubAccessToken;
    const params = qs.stringify({ access_token: githubAccessToken });
    const response = await fetch(`${GITHUB_ORGANIZATIONS}?${params}`);
    const result = await response.json();
    const testResult = result[0];

    console.log('orgs?', result[0]);

    const repoUrl: string = testResult.repos_url;
    const repoResponse = await fetch(repoUrl);
    const repoJson = await repoResponse.json();

    console.log('repo JSON?', repoJson);

    res.send('YAY');
  } catch (err) {
    const errorMessage = err.message || 'Unable to retrieve pull request info';

    logger.error(errorMessage);

    res.status(500).send({ error: errorMessage });
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const gitScry = req.session.gitScry;

    if (!gitScry) {
      throw new Error('Session expired');
    }

    const githubAccessToken: string = gitScry.githubAccessToken;
    const params = qs.stringify({ access_token: githubAccessToken });
    const response = await fetch(`${GITHUB_ORGANIZATIONS}?${params}`);
    const result = await response.json();

    const r = result.map(function (org) {
      return {
        "id": org.id,
        "login": org.login,
        "avatar_url": org.avatar_url,
        "description": org.description,
      }
    });

    res.send(r);

  } catch (err) {
    const errorMessage = err.message || 'Unable to retrieve organizations';

    logger.error(errorMessage);

    res.status(500).send({ error: errorMessage });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const gitScry = req.session.gitScry;

    if (!gitScry) {
      throw new Error('Session expired');
    }

    const githubAccessToken: string = gitScry.githubAccessToken;
    const params = qs.stringify({ access_token: githubAccessToken });
    const response = await fetch(`${GITHUB_USER}?${params}`);
    const result = await response.json();

    res.send(result);

  } catch (err) {
    const errorMessage = err.message || 'Unable to retrieve user info';

    logger.error(errorMessage);

    res.status(500).send({ error: errorMessage });
  }
};
