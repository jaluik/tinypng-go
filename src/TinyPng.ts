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
}

export default TinyPng;
