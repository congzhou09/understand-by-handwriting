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

const delaySec = 1;

middlewareArr.push(async (context, next) => {
  dataArr.push(1);
  await wait(delaySec);
  await next();
  await wait(delaySec);
  dataArr.push(2);
});

middlewareArr.push(async (context, next) => {
  dataArr.push(3);
  await wait(delaySec);
  await next();
  await wait(delaySec);
  dataArr.push(4);
});

(async () => {
  await MyCompose(middlewareArr)({}, () => {
    dataArr.push(0);
  });
  console.log(dataArr);
})();
