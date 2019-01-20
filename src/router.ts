import path from 'path';
import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

router.get('/', (_, res) => res.sendFile(path.join(__dirname, '../src/static/login.html')));

export default router;
