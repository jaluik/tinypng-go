import AsyncTaskQueue from '../src/AsyncTaskQueue';

describe('test AsyncTaskQueue', () => {
  it('should return all image files with path and originSize', (done) => {
    let a = 0;
    const startTime = new Date().getMilliseconds();
    const fn = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const end = new Date().getMilliseconds();
          a++;
          console.log('====', a);
          console.log('time', end - startTime);
          resolve(3);
        }, 30);
      });
    };
    const fnList = new Array(7).fill(1).map(() => () => fn());
    const queue = new AsyncTaskQueue(3);
    queue.setAsyncFnTasks(fnList);
    queue.run();
    setTimeout(() => {
      done();
    }, 1000);
  });
});
