const PROMISE_STATUS = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

function MyPromise(promiseFun) {
  // resolver must be a function
  if (typeof promiseFun !== 'function') {
    throw new Error('Promise resolver is not a function');
  } else {
    this.status = PROMISE_STATUS.pending;
    this.resolvedFun = null;
    this.rejectedFun = null;
    this.resolvedRet = null;
    this.rejectedRet = null;
    this._upperPromise = null; // 使链式then的每个层级reject都能调用到catch回调

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
}

MyPromise.prototype.then = function (resolvedFun, rejectedFun) {
  const retPromise = new MyPromise((resolve, reject) => {
    // 调then的时候可能还没调过resolve
    if (this.status === PROMISE_STATUS.fulfilled) {
      if (resolvedFun) {
        resolve(resolvedFun(this.resolvedRet));
      } else {
        resolve(this.resolvedRet);
      }
    } else if (this.status === PROMISE_STATUS.rejected) {
      if (rejectedFun) {
        reject(rejectedFun(this.rejectedRet));
      } else {
        reject(this.rejectedRet);
      }
    } else {
      this.resolvedFun = resolvedFun;
      this.rejectedFun = rejectedFun;
    }
  });

  retPromise._upperPromise = this;

  return retPromise;
};

MyPromise.prototype.catch = function (rejectedFun) {
  const retPromise = new MyPromise((resolve, reject) => {
    const finalRejectedFun = function (value) {
      try {
        resolve(rejectedFun && rejectedFun(value));
      } catch (err) {
        reject(err);
      }
    };
    if (this.status === PROMISE_STATUS.rejected) {
      finalRejectedFun(this.rejectedRet);
    } else {
      this.rejectedFun = finalRejectedFun;
      let upperPromise = this._upperPromise;
      while (upperPromise != null) {
        upperPromise.rejectedFun = finalRejectedFun;
        upperPromise = upperPromise._upperPromise;
      }
    }
  });
  return retPromise;
};

MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) {
    return value;
  } else {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }
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
