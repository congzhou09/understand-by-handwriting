function currying() {
  if (arguments.length < 1) {
    throw new Error(`At least one function is needed as the first param.`);
  }
  const theFun = arguments[0];
  let params = Array.prototype.slice.call(arguments, 1);
  if (params.length >= theFun.length) {
    return theFun(...params);
  }

  function getNextCurriedFun() {
    return function () {
      params = Array.prototype.concat.apply(params, arguments);
      if (params.length >= theFun.length) {
        return theFun(...params);
      } else {
        return getNextCurriedFun();
      }
    };
  }
  return getNextCurriedFun();
}

export default currying;
