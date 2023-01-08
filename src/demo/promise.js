import MyPromise from "../tools/my-promise";

const FinalPromise = MyPromise;
// const FinalPromise = Promise;

/* basic usage */
(function basicUsage() {
  const onePrmis = new FinalPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("999");
    }, 3000);
  });

  onePrmis
    .then(() => {
      console.log("wawa");
      return "oo";
    })
    .then((data) => {
      console.log(data);
    });
});

(function basicUsageTwo() {
  const onePrmis = new FinalPromise((resolve, reject) => {
    resolve(
      new FinalPromise((resolveInner) => {
        setTimeout(resolveInner, 3000);
      })
    );
  });

  onePrmis
    .then(() => {
      console.log("wawa");
      return "oo";
    })
    .then((data) => {
      console.log(data);
    });
});

/* Promise.resolve() */
(function promiseResolve() {
  const promise1 = new FinalPromise((resolve, reject) => {
    setTimeout(() => {
      reject("promise1");
    }, 1000);
  });

  FinalPromise.resolve(promise1)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
      throw new Error("just test");
    })
    .catch((err) => {
      console.error("2", err);
    });

  // FinalPromise.resolve(3).then((data) => {
  //   console.log(data);
  // });
})();

(function promiseAll() {
  const promise1 = new FinalPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise1");
    }, 1000);
  });
  const promise2 = new FinalPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise2");
    }, 2000);
  });
  FinalPromise.all([promise1, promise2, "promise3"])
    // FinalPromise.all()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
});
