const funTimerMap = new Map();

export function debounce(fun, wait = 0) {
  return function () {
    const ctx = this;
    const args = arguments;
    let timer = funTimerMap.get(fun);
    if (timer) {
      clearTimeout(timer);
      funTimerMap.set(fun, null);
    }
    funTimerMap.set(
      fun,
      setTimeout(() => {
        fun.apply(ctx, args);
      }, wait)
    );
  };
}
