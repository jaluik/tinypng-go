type PromiseTask = () => Promise<any>;

class AsyncTaskQueue {
  private asyncFnTasks: PromiseTask[];
  private maxTasks: number;
  private jobIndex: number;
  private finishCallback: Function;
  private finishedTaskNum: number;

  constructor(maxTasks) {
    this.asyncFnTasks = [];
    this.maxTasks = maxTasks;
    this.jobIndex = 0;
    this.finishedTaskNum = 0;
  }

  setAsyncFnTasks(asyncFnTasks: PromiseTask[]) {
    this.asyncFnTasks = asyncFnTasks.map(
      (task) => () =>
        task().then((res) => {
          this.finishedTaskNum++;
          this.jobIndex++;
          this.enqueueTask();
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

  enqueueTask() {
    if (this.finishedTaskNum < this.asyncFnTasks.length) {
      if (this.jobIndex < this.asyncFnTasks.length) {
        this.asyncFnTasks[this.jobIndex]();
      }
    } else {
      this.onFinishAllTask();
    }
  }

  run() {
    const initCount = Math.min(this.maxTasks, this.asyncFnTasks.length);
    const tasks = this.asyncFnTasks.slice(0, initCount);
    this.jobIndex = initCount - 1;
    tasks.forEach((fn) => fn());
  }

  clear() {
    this.asyncFnTasks = [];
    this.finishedTaskNum = 0;
    this.jobIndex = 0;
  }
}

export default AsyncTaskQueue;
