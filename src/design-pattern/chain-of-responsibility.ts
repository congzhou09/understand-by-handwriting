abstract class Handler {
  protected successor: Handler;
  setSuccessor(handler) {
    this.successor = handler;
  }
  protected next(reqData) {
    if (this.successor != undefined) {
      this.successor.handle(reqData);
    }
  }
  abstract handle(reqData): void;
}

class HandlerA extends Handler {
  handle(reqData) {
    console.log(`handlerA handle "${reqData}"`);
    this.next(reqData);
  }
}

class HandlerB extends Handler {
  handle(reqData) {
    console.log(`handlerB handle "${reqData}"`);
    this.next(reqData);
  }
}

const handlerA = new HandlerA();
const handlerB = new HandlerB();
handlerA.setSuccessor(handlerB);

handlerA.handle('DATA');
