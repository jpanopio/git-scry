import path from 'path';
import { Router } from 'express';
import {
  loginRedirect,
  getAccessToken,
  getPullRequests,
} from './controllers/github';

const router = Router();

router.get('/', (_, res) => res.sendFile(path.join(__dirname, '../src/static/login.html')));
router.get('/github-login', loginRedirect);
router.get('/github-code', getAccessToken);
router.get('/github-pull-requests', getPullRequests);

export default router;
