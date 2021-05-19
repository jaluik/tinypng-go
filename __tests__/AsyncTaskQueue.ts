import AsyncTaskQueue from '../src/AsyncTaskQueue';

describe('test AsyncTaskQueue', () => {
  it('should run task one by one', (done) => {
    const fn = jest.fn();
    const fnList = new Array(6).fill(1).map(() => async () => {
      await fn();
    });
    const queue = new AsyncTaskQueue(3);
    queue.setAsyncFnTasks(fnList);
    queue.run();
    setTimeout(() => {
      expect(fn).toBeCalledTimes(6);
      queue.clear();
      done();
    }, 10);
  });
  it('should run finishTask after all job is done', (done) => {
    const finishTask = jest.fn();
    const fn = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(3);
        }, 1);
      });
    };
    const fnList = new Array(6).fill(1).map(() => () => fn());
    fnList.push(async () => await finishTask('last job'));
    const queue = new AsyncTaskQueue(4);
    queue.setAsyncFnTasks(fnList);
    queue.setFinishCallback(finishTask);
    queue.run();
    setTimeout(() => {
      expect(finishTask).toHaveBeenNthCalledWith(1, 'last job');
      expect(finishTask).toHaveBeenNthCalledWith(2);
      done();
    }, 10);
  });
});
