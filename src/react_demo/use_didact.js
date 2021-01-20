import Didact from './didact';

/** @jsx Didact.createElement */
const rootDom = document.getElementById('app');

function tick() {
  const time = new Date().toLocaleTimeString();
  const clockElement = (
    <div>
      <span>current time:</span>
      <h1>{time}</h1>
    </div>
  );
  Didact.render(clockElement, rootDom);
}

tick();
setInterval(tick, 1000);