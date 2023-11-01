import debounce from './debounce';

describe('debounce-test', () => {
  let oneVal = 0;
  function addVal() {
    oneVal += 1;
  }

  it('no-debounce', () => {
    oneVal = 0;
    const addValDebounced = addVal;
    let timerCount = 0;
    const timer = setInterval(() => {
      addValDebounced();
      timerCount++;
      if (timerCount === 4) {
        clearInterval(timer);
        expect(oneVal).toBe(4);
      }
    }, 90);
  });

  it('debounce-tail', () => {
    oneVal = 0;
    const addValDebounced = debounce(addVal, 100);
    let timerCount = 0;
    const timer = setInterval(() => {
      addValDebounced();
      timerCount++;
      if (timerCount === 0 || timerCount === 1 || timerCount === 2 || timerCount === 3) {
        expect(oneVal).toBe(0);
      }
      if (timerCount === 4) {
        clearInterval(timer);
        setTimeout(() => {
          expect(oneVal).toBe(1);
        }, 100);
      }
    }, 90);
  });

  it('debounce-head', () => {
    oneVal = 0;
    const addValDebounced = debounce(addVal, 100, { heading: true });
    let timerCount = 0;
    const timer = setInterval(() => {
      addValDebounced();
      timerCount++;
      if (timerCount === 0) {
        expect(oneVal).toBe(1);
      }
      if (timerCount === 4) {
        clearInterval(timer);
        expect(oneVal).toBe(1);
      }
    }, 90);
  });
});
