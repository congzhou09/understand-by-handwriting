interface Implementor {
  operate(): void;
}

class ImplementorA implements Implementor {
  operate() {
    console.log(`ImplementorA op`);
  }
}

class ImplementorB implements Implementor {
  operate() {
    console.log(`ImplementorB op`);
  }
}

class Abstraction {
  private implementor: Implementor;
  constructor(implementor) {
    this.implementor = implementor;
  }
  operate() {
    this.implementor.operate();
  }
}

const abstA = new Abstraction(new ImplementorA());
const abstB = new Abstraction(new ImplementorB());

abstA.operate();
abstB.operate();
