function currying() {
  if (arguments.length < 1) {
    throw new Error(`At least the function is needed as the first param.`);
  }
  const func = arguments[0];
  const funcParamLen = func?.length;
  let params = Array.prototype.slice.call(arguments, 1) ?? [];
  if (params.length >= funcParamLen) {
    return func.apply(params);
  }

  function curryCore() {
    return function () {
      params = Array.prototype.concat.apply(params, arguments);
      if (params.length >= funcParamLen) {
        return func(...params);
      } else {
        return curryCore();
      }
    };
  }
  return curryCore();
}

export default currying;
