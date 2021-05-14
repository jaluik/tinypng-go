import { randomRequestOption } from './utils';
import { readFile, createWriteStream, ensureFile } from 'fs-extra';
import AsyncTaskQueue from './AsyncTaskQueue';
import { request } from 'https';
import { URL } from 'url';

interface SuccessItem {
  path: string;
  distPath: string;
  originSize: number;
  compressedSize: number;
}

interface FailedItem {
  path: string;
  distPath: string;
  originSize: number;
  errMsg: string;
}

interface PendingItem {
  path: string;
  distPath: string;
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
  private asyncTaskQueue: AsyncTaskQueue;

  constructor(maxTasks = 10) {
    this.pendingList = [];
    this.successList = [];
    this.failedList = [];
    this.asyncTaskQueue = new AsyncTaskQueue(maxTasks);
  }

  setPendingList(list) {
    this.pendingList = list;
  }

  async run() {
    return new Promise((resolve) => {
      const taskFnQuene = this.pendingList.map((item) => async () => {
        try {
          const res = await this.compressSinglePic(item.path, item.distPath);
          this.successList.push({
            ...item,
            compressedSize: res.output.size,
          });
        } catch (err) {
          this.failedList.push({ ...item, errMsg: err.msg });
        }
      });
      this.asyncTaskQueue.setAsyncFnTasks(taskFnQuene);
      this.asyncTaskQueue.setFinishCallback(() => {
        this.printResult();
        resolve(void 0);
      });
      this.asyncTaskQueue.run();
    });
  }

  /**
   * compress a image file and save it
   * @param sourcePath source image file path
   * @param distpath compressed image file dist path
   * @returns distpath
   */
  async compressSinglePic(sourcePath: string, distpath: string) {
    const res = await this.uploadSinglePic(sourcePath);
    console.log(`${sourcePath}上传完成`);

    const imgUrl = res.output.url;
    if (imgUrl) {
      await this.downloadSingleImg(imgUrl, distpath);
      console.log(`${sourcePath}下载完成`);
      return res;
    }
  }

  /**
   * upload a image
   * @param path source image path
   * @returns promise with upload result
   */
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

  /**
   * download image from tiny.png
   * @param address image url to download
   * @param distPath the path image to be saved
   * @returns distPath
   */
  downloadSingleImg(address, distPath: string) {
    const opts = new URL(address);
    ensureFile(distPath).then(() => {
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
    });
  }

  /**
   * print the result, inlude originTotalSize, compressedTotalSize, compressRatio
   */
  printResult() {
    const originTotalSize = this.successList.reduce(
      (prev, item) => prev + item.originSize,
      0
    );
    const compressedTotalSize = this.successList.reduce(
      (prev, item) => prev + item.compressedSize,
      0
    );
    const compressRatio = (
      ((originTotalSize - compressedTotalSize) * 100) /
      originTotalSize
    ).toFixed(2);
    if (originTotalSize > 0) {
      const text = `originTotalSize is ${originTotalSize} byte, compressedTotalSize is ${compressedTotalSize} byte, the compressRatio is ${compressRatio}%`;
      console.log(text);
    } else {
      console.log('no compressed images!');
    }
  }
}

export default TinyPng;
