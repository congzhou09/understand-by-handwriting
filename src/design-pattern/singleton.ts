class Singleton {
  private static instance: Singleton;
  private name: string;
  private constructor(name) {
    this.name = name;
  }
  static getInstance() {
    if (this.instance == undefined) {
      this.instance = new Singleton('theInstance');
    }
    return this.instance;
  }
  say() {
    console.log(`I am ${this.name}`);
  }
}

const inst = Singleton.getInstance();
const inst2 = Singleton.getInstance();

inst.say();
inst2.say();
console.log(`inst equals inst2: ${inst === inst2}`);
console.log(Singleton.name);
