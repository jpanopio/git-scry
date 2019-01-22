import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from './constants/env';

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error('GitScry requires a GitHub ID and secret');
}
