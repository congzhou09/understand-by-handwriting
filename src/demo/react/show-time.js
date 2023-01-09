// import Didact from "lib/react/didact";
import Didact from "lib/react/didact/index_with_fiber.js";

/** @jsx Didact.createElement */
const rootDom = document.getElementById("app");

function tick(hasStarted) {
  const time = new Date().toLocaleTimeString();
  const clockElement = (
    <div>
      <span>current time:</span>
      <h1>{time}</h1>
      {hasStarted ? null : <span>start!</span>}
    </div>
  );
  Didact.render(clockElement, rootDom);
}

tick();
setInterval(() => {
  tick(true);
}, 1000);
