interface Target {
  request: () => string;
}

class Adaptor implements Target {
  adaptee: Adaptee = new Adaptee();
  request() {
    return `TRANS FROM "${this.adaptee.specificRequest()}" TO "target request"`;
  }
}

class Adaptee {
  specificRequest() {
    return `inner request`;
  }
}

const oneAdaptor = new Adaptor();
console.log(oneAdaptor.request());
