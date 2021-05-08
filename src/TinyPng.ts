import { randomRequestOption } from './utils';
import { readFile, createWriteStream } from 'fs-extra';
import { request } from 'https';
import { URL } from 'url';

interface SuccessItem {
  path: string;
  originSize: number;
  compressedSize: number;
}

interface FailedItem {
  path: string;
  errMsg: string;
}

interface PendingItem {
  path: string;
  originSize: number;
}

interface UploadRes {
  input: { size: number; type: string };
  output: {
    size: number;
    type: string;
    width: number;
    height: number;
    ratio: number;
    url: string;
  };
}

class TinyPng {
  private pendingList: PendingItem[];
  private successList: SuccessItem[];
  private failedList: FailedItem[];

  constructor() {
    this.pendingList = [];
    this.successList = [];
    this.failedList = [];
  }

  setPendingList(list) {
    this.pendingList = list;
  }

  async compressSinglePic(sourcePath, distpath) {
    const res = await this.uploadSinglePic(sourcePath);
    const imgUrl = res.output.url;
    if (imgUrl) {
      const path = await this.downloadSingleImg(imgUrl, distpath);
      return path;
    }
  }

  async uploadSinglePic(path: string): Promise<UploadRes> {
    return new Promise((resolve, reject) => {
      readFile(path, (err, file) => {
        if (err) {
          console.log('err', err);
          reject(err);
        }
        const options = randomRequestOption();
        const req = request(options, (res) => {
          res.on('data', (data) => {
            const obj = JSON.parse(data.toString());
            obj.error ? reject(obj.message) : resolve(obj);
          });
        });
        req.write(file, 'binary');
        req.on('error', (err) => {
          reject(err);
        });
        req.end();
      });
    });
  }

  downloadSingleImg(address, distPath: string) {
    const opts = new URL(address);
    const write = createWriteStream(distPath, {
      encoding: 'binary',
      flags: 'w',
    });
    return new Promise((resolve, reject) => {
      const req = request(opts, (res) => {
        res.setEncoding('binary');
        res.pipe(write);
        res.on('end', () => {
          resolve(distPath);
        });
      });
      req.on('error', (error) => reject(error));
      req.end();
    });
  }
}

export default TinyPng;
