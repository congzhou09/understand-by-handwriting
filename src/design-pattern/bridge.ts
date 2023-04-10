interface Implementor {
  operate: () => void;
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

const impA = new ImplementorA();
const impB = new ImplementorB();

const abstA = new Abstraction(impA);
const abstB = new Abstraction(impB);

abstA.operate();
abstB.operate();
