function MyCompose(middlewareArr) {
  if (!Array.isArray(middlewareArr)) {
    throw new TypeError(`The input param must be an array`);
  }
  for (let fn of middlewareArr) {
    if (typeof fn != "function") {
      throw new TypeError(`Members of middleware must be functions`);
    }
  }

  return (context, next) => {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error(`next() called multiple times`));
      }
      index = i;
      let fn = middlewareArr[i];
      if (i == middlewareArr.length) {
        fn = next;
      }
      if (!fn) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

export default MyCompose;
