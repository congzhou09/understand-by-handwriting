function currying() {
  if (arguments.length < 1) {
    throw new Error(`Function name param is needed.`);
  }
  const fun = arguments[0];
  let params = Array.prototype.slice.call(arguments, 1);
  if (params.length >= fun.length) {
    return fun(...params);
  }

  function getNextCurriedFun() {
    return function () {
      params = Array.prototype.concat.apply(params, arguments);
      if (params.length >= fun.length) {
        return fun(...params);
      } else {
        return getNextCurriedFun();
      }
    };
  }
  return getNextCurriedFun();
}

export default currying;
