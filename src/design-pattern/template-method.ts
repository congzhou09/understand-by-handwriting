abstract class AbstractClass {
  protected abstract step1(): void;
  protected abstract step2(): void;
  step3() {
    console.log(`common step3`);
  }
  algorithm1() {
    this.step1();
    this.step2();
    this.step3();
  }
  algorithm2() {
    this.step1();
    this.step3();
  }
}

class ConcreteClass1 extends AbstractClass {
  step1() {
    console.log(`step1 by concrete1`);
  }
  step2() {
    console.log(`step2 by concrete1`);
  }
}

class ConcreteClass2 extends AbstractClass {
  step1() {
    console.log(`step1 by concrete2`);
  }
  step2() {
    console.log(`step2 by concrete2`);
  }
}

const concrete1 = new ConcreteClass1();
const concrete2 = new ConcreteClass2();
concrete1.algorithm1();
console.log(`------------------`);
concrete2.algorithm1();
console.log(`------------------`);
concrete2.algorithm2();
