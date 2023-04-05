class Product {
  private name: string;
  constructor(name) {
    this.name = name;
  }
  say() {
    console.log(`I am ${this.name}`);
  }
}
class Factory {
  createProduct(name): Product {
    return new Product(name);
  }
}

const oneFactory = new Factory();
const oneProduct: Product = oneFactory.createProduct('p1');
oneProduct.say();
