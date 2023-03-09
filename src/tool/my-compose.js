function MyCompose(middlewareArr) {
  if (!Array.isArray(middlewareArr)) {
    throw new Error(`input param need to be an array`);
  }

  return (context, next) => {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewareArr[i];
      if (i === middlewareArr.length) {
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
