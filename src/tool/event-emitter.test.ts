import EventEmitter from './event-emitter';

describe('event emitter base', () => {
  const consoleSpy = jest.spyOn(console, 'log');

  const oneEmitter = new EventEmitter();
  const oneFun = () => {
    console.log("I'm invoked!");
  };
  const oneEventName = 'wawa';
  it('on', () => {
    oneEmitter.on(oneEventName, oneFun);
    expect(oneEmitter.getCallbacks()).toStrictEqual({ [oneEventName]: [oneFun] });
  });
  it('emit', () => {
    oneEmitter.emit(oneEventName);
    expect(consoleSpy).toHaveBeenCalledWith("I'm invoked!");
  });
  it('off', () => {
    oneEmitter.off(oneEventName, oneFun);
    expect(oneEmitter.getCallbacks()).toStrictEqual({ [oneEventName]: [] });
  });
  it('destroy', () => {
    oneEmitter.destroy();
    expect(oneEmitter.getCallbacks()).toStrictEqual({});
  });
});
