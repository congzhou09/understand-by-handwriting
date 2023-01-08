import { debounce } from "tools/debounce";

function test() {
  console.log("wawa");
}

function foo() {
  console.log("wowo");
}

let debFun = debounce(test, 3000);
debFun();

debounce(foo, 4000)();
