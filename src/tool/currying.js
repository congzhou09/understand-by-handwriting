function currying(...args) {
  if (args.length < 1) {
    throw new Error(`At least one function is needed as the first param.`);
  }
  const theFun = args[0];
  let params = Array.prototype.slice.call(args, 1);
  if (params.length >= theFun.length) {
    return theFun(...params);
  }

  function getNextCurriedFun() {
    return function () {
      params = Array.prototype.concat.apply(params, args);
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
