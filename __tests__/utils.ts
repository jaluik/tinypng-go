import { findAllImageFile } from '../src/utils';

describe('test findAllImageFile', () => {
  it('should return all files', (done) => {
    findAllImageFile(__dirname).then((data) => {
      console.log('data', data);
    });
    setTimeout(() => {
      done();
    }, 2000);
  });
});
