type CallbackFunType = (...args: any[]) => any;
type CallbacksType = Record<string, CallbackFunType[]>;

class EventEmitter {
  private callbacks: CallbacksType = {};

  on(event: string, fun: CallbackFunType) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(fun);
    } else {
      this.callbacks[event] = [fun];
    }
  }
  off(event: string, fun: CallbackFunType) {
    if (this.callbacks[event]?.length > 0) {
      this.callbacks[event] = this.callbacks[event].filter((one) => one !== fun);
    }
  }
  emit(event: string, ...args: any) {
    const callbacks = this.callbacks[event];

    if (callbacks) {
      callbacks.forEach((callback) => callback.apply(this, args));
    }
  }
  destroy(): void {
    this.callbacks = {};
  }
  getCallbacks(): Readonly<CallbacksType> {
    return this.callbacks;
  }
}

export default EventEmitter;
