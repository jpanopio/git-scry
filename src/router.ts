import path from 'path';
import { Router } from 'express';
import {
  loginRedirect,
  getAccessToken,
  getPullRequests,
  getOrganizations,
  getSessionStatus,
  getUserInfo
} from './controllers/github';

const router = Router();

router.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.get('/', (_, res) => res.sendFile(path.join(__dirname, '../src/static/login.html')));
router.get('/github-login', loginRedirect);
router.get('/github-login-check', getSessionStatus);
router.get('/github-code', getAccessToken);
router.get('/github-pull-requests', getPullRequests);
router.get('/github-organizations', getOrganizations);
router.get('/github-user-info', getUserInfo);

export default router;
