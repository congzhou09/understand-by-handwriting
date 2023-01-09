// import Didact from "lib/react/didact";
import Didact from "lib/react/didact/index_with_fiber.js";
import "./index.css";

/** @jsx Didact.createElement */
const rootDom = document.getElementById("app");

const games = ["Double Dragon", "Contra", "Super Mario", "Battle City"];
const likes = games.map((game) => Math.ceil(Math.random() * 100));

function getOneGame(gameName, likesIndex) {
  function like() {
    likes[likesIndex] += 1;
    render();
  }
  return (
    <li>
      <button onClick={like} style="width: 80px;">
        {likes[likesIndex]}
        <b>❤️</b>
      </button>
      <span style="margin-left: 10px;">{gameName}</span>
    </li>
  );
}

function render() {
  Didact.render(
    <div>
      <h1>Game Ranking List</h1>
      <ul>
        {games.map((game, index) => {
          return getOneGame(game, index);
        })}
      </ul>
    </div>,
    rootDom
  );
}

render();
