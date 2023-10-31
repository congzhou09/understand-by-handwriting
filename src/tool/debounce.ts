const funTimerMapHead = new Map();
const funTimerMapTail = new Map();

export function debounce(fun, wait = 0, { heading = false } = {}) {
  return function (...args: unknown[]) {
    // eslint-disable-next-line
    const ctx = this;
    if (heading) {
      const timer = funTimerMapHead.get(fun);
      if (!timer) {
        fun.apply(ctx, args);
        funTimerMapHead.set(
          fun,
          setTimeout(function () {
            clearTimeout(timer);
            funTimerMapHead.set(fun, null);
          }, wait),
        );
      }
    } else {
      const timer = funTimerMapTail.get(fun);
      if (timer) {
        clearTimeout(timer);
        funTimerMapTail.set(fun, null);
      }
      funTimerMapTail.set(
        fun,
        setTimeout(() => {
          fun.apply(ctx, args);
        }, wait),
      );
    }
  };
}
