const funTimerMapHead = new Map();
const funTimerMapTail = new Map();

function debounce(fun, wait = 0, { leading = false } = {}) {
  return function (...args: unknown[]) {
    // eslint-disable-next-line
    const ctx = this;
    if (leading) {
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

export default debounce;
