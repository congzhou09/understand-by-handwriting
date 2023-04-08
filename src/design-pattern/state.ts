interface PlayerState {
  getName: () => string; // state name
  next: () => void; // switch to next song
  playOrPause: () => void;
}

enum STATE_NAME {
  PAUSED = 'paused',
  PLAYING = 'playing',
  STOPPED = 'stopped',
}

class PausedState implements PlayerState {
  private player: MusicPlayer;
  constructor(player) {
    this.player = player;
  }
  next() {
    // console.log('stop playing');
    this.player.changeState(STATE_NAME.STOPPED);
    this.player.nextSong();
  }
  playOrPause() {
    // console.log('restore playing');
    this.player.changeState(STATE_NAME.PLAYING);
  }
  getName() {
    return STATE_NAME.PAUSED.toString();
  }
}

class StoppedState implements PlayerState {
  private player: MusicPlayer;
  constructor(player) {
    this.player = player;
  }
  next() {
    this.player.nextSong();
  }
  playOrPause() {
    // console.log('start playing');
    this.player.changeState(STATE_NAME.PLAYING);
  }
  getName() {
    return STATE_NAME.STOPPED.toString();
  }
}

class PlayingState implements PlayerState {
  private player: MusicPlayer;
  constructor(player) {
    this.player = player;
  }
  next() {
    this.player.changeState(STATE_NAME.STOPPED);
    this.player.nextSong();
    this.player.changeState(STATE_NAME.PLAYING);
  }
  playOrPause() {
    // console.log('pause playing');
    this.player.changeState(STATE_NAME.PAUSED);
  }
  getName() {
    return STATE_NAME.PLAYING.toString();
  }
}

class MusicPlayer {
  private state: PlayerState;
  private stateMap = new Map();
  private index = 0;
  private playList;
  constructor(playList = []) {
    this.playList = playList;
    this.changeState(STATE_NAME.STOPPED);
  }
  changeState(newState) {
    switch (newState) {
      case STATE_NAME.STOPPED: {
        this.state = this.stateMap.get(STATE_NAME.STOPPED);
        if (!this.state) {
          this.state = new StoppedState(this);
          this.stateMap.set(STATE_NAME.STOPPED, this.state);
        }
        break;
      }
      case STATE_NAME.PAUSED: {
        this.state = this.stateMap.get(STATE_NAME.PAUSED);
        if (!this.state) {
          this.state = new PausedState(this);
          this.stateMap.set(STATE_NAME.PAUSED, this.state);
        }
        break;
      }
      case STATE_NAME.PLAYING: {
        this.state = this.stateMap.get(STATE_NAME.PLAYING);
        if (!this.state) {
          this.state = new PlayingState(this);
          this.stateMap.set(STATE_NAME.PLAYING, this.state);
        }
        break;
      }

      default:
        break;
    }
  }
  showCurInfo() {
    console.log(`current state: "${this.getState()}", current song: "${this.playList[this.index]}"`);
  }
  nextSong() {
    this.index = (this.index + 1) % this.playList.length;
  }
  clickNext() {
    this.state.next();
    this.showCurInfo();
  }
  clickPlayOrPause() {
    this.state.playOrPause();
    this.showCurInfo();
  }
  getState() {
    return this.state.getName();
  }
}

const player = new MusicPlayer(['nothing in the world', 'someone like you', 'heal the world']);
player.showCurInfo();
player.clickPlayOrPause();
player.clickNext();
player.clickPlayOrPause();
player.clickNext();
player.clickNext();
