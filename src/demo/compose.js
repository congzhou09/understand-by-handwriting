import MyCompose from "../tool/my-compose";

const middlewareArr = [];
const dataArr = [];

function wait(sec = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
}

function pushAndConsole(...params) {
  dataArr.push(...params);
  console.log(...params);
}

const delaySec = 1;

middlewareArr.push(async (context, next) => {
  pushAndConsole(1);
  await wait(delaySec);
  await next();
  await wait(delaySec);
  pushAndConsole(2);
});

middlewareArr.push(async (context, next) => {
  pushAndConsole(3);
  await wait(delaySec);
  await next();
  // await next();
  await wait(delaySec);
  pushAndConsole(4);
});

(async () => {
  await MyCompose(middlewareArr)({}, () => {
    pushAndConsole(0);
  });
  console.log(dataArr);
})();
