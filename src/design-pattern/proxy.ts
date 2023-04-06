interface Subject {
  request: () => string;
}

class RealSubject implements Subject {
  request() {
    return 'real request';
  }
}

class ProxySubject implements Subject {
  realSubject: Subject;
  constructor() {
    this.realSubject = new RealSubject();
  }
  request() {
    return this.realSubject.request();
  }
}

const proxySubject = new ProxySubject();
console.log(proxySubject.request());
