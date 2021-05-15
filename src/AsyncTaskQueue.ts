type PromiseTask = () => Promise<any>;

class AsyncTaskQueue {
  private asyncFnTasks: PromiseTask[];
  private maxTasks: number;
  private finishCallback: Function;
  private taskIndex: number;
  private finished: boolean;

  constructor(maxTasks) {
    this.asyncFnTasks = [];
    this.maxTasks = maxTasks;
    this.taskIndex = 0;
    this.finished = false;
  }

  setAsyncFnTasks(asyncFnTasks: PromiseTask[]) {
    this.asyncFnTasks = asyncFnTasks.map(
      (task) => () =>
        task().then((res) => {
          this.enqueTask();
          return res;
        })
    );
  }

  setFinishCallback(fn) {
    this.finishCallback = fn;
  }

  onFinishAllTask() {
    if (this.finishCallback) {
      this.finishCallback();
    }
  }

  enqueTask() {
    if (this.taskIndex < this.asyncFnTasks.length - 1) {
      this.asyncFnTasks[++this.taskIndex]();
    } else if (this.finished) {
      this.onFinishAllTask();
    } else {
      this.finished = true;
    }
  }

  run() {
    const initCount = Math.min(this.maxTasks, this.asyncFnTasks.length);
    const tasks = this.asyncFnTasks.slice(0, initCount);
    this.taskIndex = initCount - 1;
    tasks.forEach((fn) => fn());
  }

  clear() {
    this.asyncFnTasks = [];
    this.taskIndex = 0;
  }
}

export default AsyncTaskQueue;
