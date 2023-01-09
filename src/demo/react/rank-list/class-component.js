// import Didact from "lib/react/didact";
import Didact from "lib/react/didact/index_with_fiber";
import "./index.css";

/** @jsx Didact.createElement */
const rootDom = document.getElementById("app");

class App extends Didact.Component {
  constructor(props) {
    super(props);
    this.games = ["Double Dragon", "Contra", "Super Mario", "Battle City"];
  }
  render() {
    return (
      <div>
        <h1>Game Ranking List</h1>
        <ul>
          {this.games.map((oneGame) => (
            <Game name={oneGame} />
          ))}
        </ul>
      </div>
    );
  }
}

class Game extends Didact.Component {
  constructor(props) {
    super(props);

    const likes = Math.ceil(Math.random() * 100);
    this.state = {
      likes,
    };
    this.likeFun = this.like.bind(this);
  }
  like(e) {
    this.setState({
      likes: this.state.likes + 1,
    });
  }
  render() {
    return (
      <li>
        <button onClick={this.likeFun} style="width: 80px;">
          {this.state.likes}
          <b>❤️</b>
        </button>
        <span style="margin-left: 10px;">{this.props.name}</span>
      </li>
    );
  }
}

Didact.render(<App />, rootDom);
