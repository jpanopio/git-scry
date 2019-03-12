import { Request, Response } from 'express';
import logger from '../../logger';

export const exportPullRequests = async (req: Request, res: Response) => {
  logger.info('Formatter - Exporting Pull Requests');

  const pullRequests = req.body;

  res.status(200).send('OK');
};
