import { randomRequestOption } from './utils';
import { readFile } from 'fs-extra';
import https from 'https';
import { URL } from 'url';

interface SuccessItem {
  path: string;
  originSize: number;
  compressedSize: number;
}

interface failedItem {
  path: string;
  errMsg: string;
}

interface pendingItem {
  path: string;
  originSize: number;
}

class TinyPng {
  private pendingList: pendingItem[];
  private successList: SuccessItem[];
  private failedList: failedItem[];

  constructor() {
    this.pendingList = [];
    this.successList = [];
    this.failedList = [];
  }

  setPendingList(list) {
    this.pendingList = list;
  }

  async uploadSinglePic(path: string) {
    return new Promise((resolve, reject) => {
      readFile(path, (err, file) => {
        if (err) {
          reject(err);
        }
        const options = randomRequestOption();
        const req = https.request(options, (res) => {
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

  downloadSingleImg(address) {
    const opts = new URL(address);
    return new Promise((resolve, reject) => {
      const req = https.request(opts, (res) => {
        let file = '';
        res.setEncoding('binary');
        res.on('data', (chunk) => (file += chunk));
        res.on('end', () => resolve(file));
      });
      req.on('error', (error) => reject(error));
      req.end();
    });
  }
}

export default TinyPng;
