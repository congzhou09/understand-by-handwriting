const PROMISE_STATUS = {
  pending: "pending",
  fulfilled: "fulfilled",
  rejected: "rejected",
};

function MyPromise(promiseFun) {
  this.status = PROMISE_STATUS.pending;
  this.resolvedFun = null;
  this.rejectedFun = null;
  this.resolvedRet = null;
  this.rejectedRet = null;

  const _this = this;

  function resolve(resolvedRet) {
    if (resolvedRet instanceof MyPromise) {
      // 如果resolve传入的是个Promise对象
      const thisResolve = resolve.bind(_this);
      const thisReject = reject.bind(_this);
      resolvedRet
        .then(function (data) {
          thisResolve(data);
        })
        .catch(function (err) {
          thisReject(err);
        });
    } else {
      this.resolvedRet = resolvedRet;
      this.resolvedFun && this.resolvedFun(this.resolvedRet); // 调resolve的时候可能还没调过then
      this.status = PROMISE_STATUS.fulfilled;
    }
  }
  function reject(rejectedRet) {
    this.rejectedRet = rejectedRet;
    this.rejectedFun && this.rejectedFun(this.rejectedRet);
    this.status = PROMISE_STATUS.rejected;
  }

  promiseFun && promiseFun(resolve.bind(this), reject.bind(this));
}

MyPromise.prototype.then = function (resolvedFun, rejectedFun) {
  const _this = this;
  return new MyPromise(function (resolve, reject) {
    const finalResolvedFun = function () {
      resolvedFun && resolve(resolvedFun(_this.resolvedRet));
    };
    const finalRejectedFun = function () {
      if (rejectedFun) {
        reject(rejectedFun(_this.rejectedRet));
      } else {
        reject(_this.rejectedRet);
      }
    };
    try {
      // 调then的时候可能还没调过resolve
      if (_this.status === PROMISE_STATUS.fulfilled) {
        finalResolvedFun();
      } else if (_this.status === PROMISE_STATUS.rejected) {
        finalRejectedFun();
      } else {
        _this.resolvedFun = finalResolvedFun;
      }
    } catch (error) {
      reject(error);
    }
  });
};

MyPromise.prototype.catch = function (rejectedFun) {
  if (this.status === PROMISE_STATUS.rejected) {
    rejectedFun && rejectedFun(this.rejectedRet);
  } else {
    this.rejectedFun = rejectedFun;
  }
};

MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => {
    resolve(value);
  });
};

MyPromise.all = function (promiseArr) {
  return new MyPromise((resolve, reject) => {
    const resultArr = [];
    let resultCount = 0;

    function checkAndResolve() {
      resultCount++;
      if (promiseArr.length === resultCount) {
        resolve(resultArr);
      }
    }

    if (Array.isArray(promiseArr)) {
      promiseArr.forEach((onePromise, index) => {
        if (onePromise instanceof MyPromise) {
          onePromise
            .then((data) => {
              resultArr[index] = data;
              checkAndResolve();
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          resultArr[index] = onePromise;
          checkAndResolve();
        }
      });
    } else {
      reject(new Error(`${promiseArr} is not iterable `));
    }
  });
};

export default MyPromise;
