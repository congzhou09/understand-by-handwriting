type MemoStateType = Originator['state'];

class Memento {
  private state: MemoStateType;
  constructor(state: MemoStateType) {
    this.state = state;
  }
  getState() {
    return this.state;
  }
}

class CareTaker {
  private mementoList: Array<Memento> = [];
  addMemento(memo: Memento) {
    this.mementoList.push(memo);
  }
  getMemento(index?: number) {
    if (index == undefined) {
      return this.mementoList.pop();
    } else {
      const ret = this.mementoList[index];
      if (index >= 0) {
        this.mementoList.length = index;
      }
      return ret;
    }
  }
}

class Originator {
  state = 1;
  createMemento() {
    return new Memento(this.state);
  }
  setMemento(memo: Memento) {
    this.state = memo.getState();
  }
  operate() {
    this.state++;
  }
  display() {
    console.log(`current state is `, this.state);
  }
}

const originator = new Originator();
const careTaker = new CareTaker();
careTaker.addMemento(originator.createMemento());
originator.operate();
careTaker.addMemento(originator.createMemento());
originator.operate();
originator.display();

console.log(`-------------start restore---------`);
originator.setMemento(careTaker.getMemento());
originator.display();
originator.setMemento(careTaker.getMemento(0));
originator.display();
