import path from 'path';
import fs from 'fs';
import util from 'util';
import { Request, Response } from 'express';
import logger from '../../logger';

const PR_FILE_NAME = 'pr-export.txt';

export const exportPullRequests = async (req: Request, res: Response) => {
  logger.info('Formatter - Exporting Pull Requests');

  const pullRequests = req.body;

  await new Promise(
    (resolve, reject) => {
      const writeStream = fs.createWriteStream(PR_FILE_NAME);

      writeStream.on('error', (err) => reject(err));
      writeStream.on('finish', resolve);
    
      pullRequests.forEach(
        (pullRequest) => {
          const repo = pullRequest.repository_url;
          const title = pullRequest.title;
          const body = pullRequest.body;
    
          writeStream.write(`${title} - ${repo}\n`);
          writeStream.write(`${body}\n\n`);
        }
      );

      writeStream.end();
    }
  );

  const filePath = path.resolve(__dirname, '../../../pr-export.txt');

  res.download(filePath, PR_FILE_NAME);
};
