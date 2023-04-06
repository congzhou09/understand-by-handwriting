class Observer {
  static obIndex = 0;
  index: number;
  constructor() {
    this.index = Observer.obIndex++;
  }
  update(newVal) {
    console.log(`observer(${this.index}) updated with value "${newVal}"`);
  }
}

class Subject {
  obList: Array<Observer> = [];
  attach(observer) {
    console.log(`add ob ${observer.index} into list`);
    this.obList.push(observer);
  }
  detach(observer) {
    const indexToDel = this.obList.findIndex((one) => {
      return one === observer;
    });
    if (indexToDel >= 0) {
      console.log(`delete ob ${observer.index} from list`);
      delete this.obList[indexToDel];
    }
  }
  notify(newVal) {
    this.obList.forEach((one) => {
      one.update(newVal);
    });
  }
}

const subject = new Subject();
const observerObj = {};
for (let i = 0; i < 3; i++) {
  observerObj[i] = new Observer();
}
for (let i = 0; i < 3; i++) {
  subject.attach(observerObj[i]);
}
subject.notify('a piece of news');
subject.detach(observerObj[1]);
subject.notify('annother piece of news');
