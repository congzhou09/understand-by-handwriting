export class MinHeap<T> {
  constructor(readonly _heap: Array<T> = [], compareFun?: MinHeap<T>['_compareFun']) {
    if (compareFun) {
      this._compareFun = compareFun;
    }
  }

  get length() {
    return this._heap.length;
  }

  create(heapNodes: Array<T>) {
    this._heap.length = 0;
    heapNodes.forEach((one) => {
      this.push(one);
    });
  }

  push(oneNode: T) {
    this._heap.push(oneNode);
    this._siftUp(this.length - 1);
  }

  pop() {
    const top = this._heap[0];
    this._heap[0] = this._heap[this.length - 1];
    this._heap.length = this.length - 1;
    this._siftDown(0);
    return top;
  }

  stringify() {
    return JSON.stringify(this._heap);
  }

  print() {
    console.log(this.stringify());
  }

  private _siftUp(i: number) {
    let index = i;
    while (index > 0) {
      const parentIndex = (index - 1) >>> 1;
      if (this._compareFun(this._heap[parentIndex], this._heap[index])) {
        [this._heap[parentIndex], this._heap[index]] = [this._heap[index], this._heap[parentIndex]];
        index = parentIndex;
      } else {
        return;
      }
    }
  }

  private _siftDown(i: number) {
    let index = i;
    const maxIndex = Math.floor((this.length - 2) / 2);
    while (index <= maxIndex) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;
      const leftChild = this._heap[leftIndex];
      const rightChild = this._heap[rightIndex];
      let minChild: T;
      let minIndex: number;
      if (rightChild == undefined) {
        minChild = leftChild;
        minIndex = leftIndex;
      } else {
        if (this._compareFun(leftChild, rightChild)) {
          minChild = rightChild;
          minIndex = rightIndex;
        } else {
          minChild = leftChild;
          minIndex = leftIndex;
        }
      }
      if (this._compareFun(this._heap[index], minChild)) {
        [this._heap[index], this._heap[minIndex]] = [this._heap[minIndex], this._heap[index]];
        index = minIndex;
      } else {
        return;
      }
    }
  }

  private _compareFun(a: T, b: T) {
    return (a as number) - (b as number) > 0;
  }
}
