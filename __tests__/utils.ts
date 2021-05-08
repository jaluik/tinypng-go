import { findAllImageFile } from '../src/utils';
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
});
