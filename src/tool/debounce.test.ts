import debounce from './debounce';

describe('tailing', () => {
  it('first', () => {
    let oneVal = 0;
    function addVal() {
      oneVal += 1;
    }
    const addValDebounced = debounce(addVal, 100);
    let timerCount = 0;
    const timer = setInterval(() => {
      addValDebounced();
      timerCount++;
      if (timerCount === 4) {
        clearInterval(timer);
      }
    }, 90);
    expect(oneVal).toBe(1);
  });
});
