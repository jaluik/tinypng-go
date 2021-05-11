type PromiseTask = () => Promise<any>;

class AsyncTaskQueue {
  private asyncFnTasks: PromiseTask[];
  private maxTasks: number;
  private taskIndex: number;

  constructor(maxTasks) {
    this.asyncFnTasks = [];
    this.maxTasks = maxTasks;
    this.taskIndex = 0;
  }

  setAsyncFnTasks(asyncFnTasks: PromiseTask[]) {
    this.asyncFnTasks = asyncFnTasks.map(
      (task, index) => () =>
        task().then((res) => {
          this.onFinishOneTask(index);
          this.enqueTask();
          return res;
        })
    );
  }

  onFinishOneTask(finishIndex: number) {
    console.log('finishIndex', finishIndex);
    if (finishIndex === this.asyncFnTasks.length - 1) {
      this.onFinishAllTask();
    }
  }

  onFinishAllTask() {
    console.log('finishAllIndex');
  }

  enqueTask() {
    if (this.taskIndex < this.asyncFnTasks.length - 1) {
      this.asyncFnTasks[this.taskIndex++]();
    }
  }

  init() {
    const tasks = this.asyncFnTasks.slice(0, this.maxTasks);
    this.taskIndex = this.maxTasks - 1;
    tasks.forEach((fn) => fn());
  }

  clear() {
    this.asyncFnTasks = [];
    this.taskIndex = 0;
  }
}

export default AsyncTaskQueue;
