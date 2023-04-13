/*
 * Element classes that will be processed by visitors,
 * implements this interface
 */
interface ElementForVisit {
  letVisit(visitor: Visitor): void;
}

class TypeA implements ElementForVisit {
  static indexCount = 1;
  private index: number;
  constructor() {
    this.index = TypeA.indexCount++;
  }
  name() {
    return `objA-${this.index}`;
  }
  letVisit(visitor: Visitor) {
    visitor.visitTypeA(this);
  }
}

class TypeB implements ElementForVisit {
  static indexCount = 1;
  private index: number;
  constructor() {
    this.index = TypeB.indexCount++;
  }
  name() {
    return `objB-${this.index}`;
  }
  letVisit(visitor: Visitor) {
    visitor.visitTypeB(this);
  }
}

interface Visitor {
  visitTypeA(elem: TypeA): void;
  visitTypeB(elem: TypeB): void;
}

// process of "Visitor1"
class Visitor1 implements Visitor {
  visitTypeA(elem: TypeA) {
    console.log(`visitor1 visit "${elem.name()}"`);
  }
  visitTypeB(elem: TypeB) {
    console.log(`visitor1 visit "${elem.name()}"`);
  }
}

// process of "Visitor2"
class Visitor2 implements Visitor {
  visitTypeA(elem: TypeA) {
    console.log(`visitor2 visit "${elem.name()}"`);
  }
  visitTypeB(elem: TypeB) {
    console.log(`visitor2 visit "${elem.name()}"`);
  }
}

const elemArr = [];
elemArr.push(new TypeA());
elemArr.push(new TypeB());
elemArr.push(new TypeB());
elemArr.push(new TypeA());

// perform process1
const process1 = new Visitor1();
elemArr.forEach((one) => {
  one.letVisit(process1);
});

console.log(`----------------`);

// perform process2
const process2 = new Visitor2();
elemArr.forEach((one) => {
  one.letVisit(process2);
});
