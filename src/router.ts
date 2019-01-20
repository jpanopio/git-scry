import path from 'path';
import { Router } from 'express';
import { loginRedirect, getAccessToken } from './controllers/github';

const router = Router();

router.get('/', (_, res) => res.sendFile(path.join(__dirname, '../src/static/login.html')));
router.get('/github-login', loginRedirect);
router.get('/github-code', getAccessToken);

export default router;
