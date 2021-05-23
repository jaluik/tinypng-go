import { readdir, stat } from 'fs-extra';
import { join, resolve } from 'path';

const TINYIMG_URL = ['tinyjpg.com', 'tinypng.com'];

/**
 * generate random X-Forward-For to avoid  to be forbidden by tinypng.com
 * @returns random headers
 */
export const randomHeader = () => {
  const ip = new Array(4)
    .fill(0)
    .map(() => Math.round(Math.random() * 255))
    .join('.');

  return {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Postman-Token': Date.now(),
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'X-Forwarded-For': ip,
  };
};

/**
 * random request tinyjpg.com or tinypng.com
 * @returns random http request option
 */
export const randomRequestOption = () => {
  const index = Math.random() < 0.5 ? 0 : 1;

  const headers = randomHeader();
  return {
    headers,
    hostname: TINYIMG_URL[index],
    method: 'POST',
    path: '/web/shrink',
    rejectUnauthorized: false,
  };
};

export const canHandledImage = (fileName: string) => {
  if (!fileName) {
    return false;
  }
  return (
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg')
  );
};

/**
 *
 * @param sourcePath complete path
 * @returns
 */
export const findAllImageFile = (
  sourcePath
): Promise<{ path: string; originSize: number }[]> => {
  const toCompressList = [];
  let depth = 0;
  return new Promise((resolve, reject) => {
    (function traversePath(path) {
      depth++;
      readdir(path, (err, fileNames) => {
        depth--;
        if (err) {
          reject(err);
        }
        fileNames &&
          fileNames.forEach((fileName) => {
            const filePath = join(path, fileName);
            depth++;
            stat(filePath, (err, stats) => {
              depth--;
              if (err) {
                reject(err);
              }
              if (stats.isDirectory()) {
                traversePath(filePath);
              }
              if (stats.isFile()) {
                if (canHandledImage(fileName)) {
                  toCompressList.push({
                    path: filePath,
                    originSize: stats.size,
                  });
                }
              }
              if (depth === 0) {
                resolve(toCompressList);
              }
            });
          });
      });
    })(sourcePath);
  });
};

/**
 * get full path from relative path
 * @param path relative path
 * @returns full path
 */
export const getFullPath = (path: string): string => {
  return resolve(process.cwd(), path);
};
