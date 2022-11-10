import MyPromise from "./tools/my-promise";

const FinalPromise = MyPromise;
// const FinalPromise = Promise;

const onePrmis = new FinalPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("999");
  }, 3000);

  // resolve(
  //   new FinalPromise((resolveInner) => {
  //     setTimeout(resolveInner, 3000);
  //   })
  // );
});

onePrmis
  .then(() => {
    console.log("wawa");
    return "oo";
  })
  .then((data) => {
    console.log(data);
  });
