// the final executor
class Reciever {
  function1(reqData) {
    console.log(`do fun1${reqData ? ` with "${reqData}"` : ''}`);
  }
  function2(reqData) {
    console.log(`do fun2${reqData ? ` with "${reqData}"` : ''}`);
  }
}

interface Command {
  execute(reqData): void;
}

class Command1 implements Command {
  private receiver = new Reciever();
  execute(reqData) {
    this.receiver.function1(reqData);
  }
}

class Command2 implements Command {
  private receiver = new Reciever();
  execute(reqData) {
    this.receiver.function2(reqData);
  }
}

// the initiator
class Invoker {
  callCommand(cmd: Command, reqData?: string) {
    cmd.execute(reqData);
  }
}

const invoker = new Invoker();
invoker.callCommand(new Command1(), 'DATA');
invoker.callCommand(new Command2());
