import {
  findAllImageFile,
  canHandledImage,
  getFullPath,
  randomRequestOption,
} from '../src/utils';
import fsextra from 'fs-extra';
import { resolve } from 'path';

describe('test findAllImageFile', () => {
  it('should return all image files with path and originSize', (done) => {
    findAllImageFile(__dirname).then((data) => {
      expect(data).toEqual(
        expect.arrayContaining([
          {
            path: resolve(__dirname, './images/test.png'),
            originSize: 376,
          },
          {
            path: resolve(__dirname, './no-images/no-image/b/test2.png'),
            originSize: 281,
          },
        ])
      );
      done();
    });
  });
  it('should throw error when passed wrong path', (done) => {
    findAllImageFile('aa').catch((err) => {
      expect(err.code).toBe('ENOENT');
      done();
    });
  });

  it('should throw error when can not read file', (done) => {
    findAllImageFile('aa').catch((err) => {
      expect(err.code).toBe('ENOENT');
      done();
    });
  });
});

describe('test canHandledImage', () => {
  it('should return all image files with path and originSize', () => {
    expect(canHandledImage('a.jpg')).toBeTruthy();
    expect(canHandledImage('a.png')).toBeTruthy();
    expect(canHandledImage('a')).toBeFalsy();
    expect(canHandledImage('a.svg')).toBeFalsy();
    expect(canHandledImage(undefined)).toBeFalsy();
    expect(canHandledImage('a.png.svg')).toBeFalsy();
  });
});

describe('test getFullPath', () => {
  it('should return complete path based on process path', () => {
    expect(getFullPath('a.png')).toEqual(resolve(process.cwd(), 'a.png'));
  });
});

describe('test randomRequestOption', () => {
  it('should return random X-Forwarded-For header ', () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.2;
    global.Math = mockMath;
    const option1 = randomRequestOption();
    mockMath.random = () => 0.6;
    global.Math = mockMath;
    const option2 = randomRequestOption();
    expect(option1.headers['X-Forwarded-For']).not.toEqual(
      option2.headers['X-Forwarded-For']
    );
    expect(option1.hostname).not.toEqual(option2.hostname);
  });
});
