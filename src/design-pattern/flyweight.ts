class FlyweightFactory {
  private static flyweightMap = new Map();
  static getFlyweight(intrinsic) {
    let cachedFlyWeight = this.flyweightMap.get(intrinsic);
    if (!cachedFlyWeight) {
      cachedFlyWeight = new FlyWeight(intrinsic);
      this.flyweightMap.set(intrinsic, cachedFlyWeight);
    }
    return cachedFlyWeight;
  }
  static getFlywightMapKeys() {
    return [...this.flyweightMap.keys()];
  }
}

class FlyWeight {
  private intrinsic: string;
  constructor(intrinsic) {
    this.intrinsic = intrinsic;
  }
  operate(extrinsic) {
    console.log(`op with intrinsic: "${this.intrinsic}" and extrinsic: "${extrinsic}"`);
  }
}

class Context {
  private flyWeight: FlyWeight;
  private extrinsic: string;
  constructor(intrinsic, extrinsic) {
    this.flyWeight = FlyweightFactory.getFlyweight(intrinsic);
    this.extrinsic = extrinsic;
  }
  operate() {
    this.flyWeight.operate(this.extrinsic);
  }
}

const redPen = new Context('pen', 'red');
const bluePen = new Context('pen', 'blue');
const redPencil = new Context('pencil', 'red');

redPen.operate();
redPencil.operate();
bluePen.operate();

console.log(`flyweightMap keys array: `, FlyweightFactory.getFlywightMapKeys());

export {}; // If don't contain at least 1 import or export statement, the file is considered as global and may lead to name clashing
