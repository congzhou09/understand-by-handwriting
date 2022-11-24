export let requestHostCallback;

let callbackArr = [];
let deadTime = 0;

const msgChannel = new MessageChannel();
const port = msgChannel.port2;

msgChannel.port1.onmessage = function () {
  const curCallbackArr = callbackArr.concat();
  callbackArr.length = 0;
  while (curCallbackArr?.length > 0) {
    const oneCallback = curCallbackArr.shift();
    if (typeof oneCallback === "function") {
      oneCallback({
        timeRemaining: () => {
          return deadTime - performance.now();
        },
      });
    }
  }
};

requestHostCallback = function (callback) {
  callbackArr.push(callback);
  deadTime = performance.now() + 5;
  port.postMessage(null);
};
