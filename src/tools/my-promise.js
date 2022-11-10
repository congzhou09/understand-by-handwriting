const PROMISE_STATUS = {
  pending: "pending",
  fulfilled: "fulfilled",
  rejected: "rejected",
};

const MyPromise = function (promiseFun) {
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
};

MyPromise.prototype.then = function (resolvedFun) {
  const _this = this;
  return new MyPromise(function (resolve, reject) {
    const finalResolvedFun = function () {
      resolvedFun && resolve(resolvedFun(this.resolvedRet));
    };
    try {
      // 调then的时候可能还没调过resolve
      if (_this.status === PROMISE_STATUS.fulfilled) {
        finalResolvedFun();
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

export default MyPromise;
