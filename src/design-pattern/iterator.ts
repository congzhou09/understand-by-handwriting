class ListStrIterator implements Iterator<any> {
  private list: Array<any>;
  private index = 0;
  constructor(listStr: string) {
    this.list = listStr.split(',');
  }
  // JS iterator protocol
  next() {
    if (this.index < this.list.length) {
      return { done: false, value: this.list[this.index++] };
    }
    return { done: true, value: undefined };
  }
}

class ListStr {
  private data = '';
  constructor(listStr) {
    if (!/[\w,\s]+/.test(listStr)) {
      throw new Error('The input string should be comma delimited words');
    }
    this.data = listStr;
  }
  getIterator() {
    return new ListStrIterator(this.data);
  }
  // JS iterable protocol
  [Symbol.iterator]() {
    return new ListStrIterator(this.data);
  }
}

const oneListStr = new ListStr('2,3,10');
const oneIt = oneListStr.getIterator();
let curObj = oneIt.next();
while (curObj.done === false) {
  console.log(curObj.value);
  curObj = oneIt.next();
}

// <features of iterable object
console.log([...oneListStr]);

for (const one of oneListStr) {
  console.log(one);
}
// features of iterable object>
