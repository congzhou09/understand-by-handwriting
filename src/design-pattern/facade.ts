class Facade {
  private systemA: SystemA;
  private systemB: SystemB;
  constructor(systemA, systemB) {
    this.systemA = systemA;
    this.systemB = systemB;
  }
  wrappedOperation() {
    return `"${this.systemA.operation()}" PLUS "${this.systemB.operation()}"`;
  }
}

class SystemA {
  operation() {
    return `SystemA op`;
  }
}

class SystemB {
  operation() {
    return `SystemB op`;
  }
}

const systemA = new SystemA();
const systemB = new SystemB();
const facade = new Facade(systemA, systemB);
console.log(facade.wrappedOperation());
