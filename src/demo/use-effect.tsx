import React, { useState } from 'react';
import ReactDom from 'react-dom';
import useMountEffect from '../tool/hook/use-mount-effect';
import useUpdateEffect from '../tool/hook/use-update-effect';

const App = () => {
  const [count, setCount] = useState(0);
  useMountEffect(() => {
    console.log(`mount effect, count: ${count}`);
  }, [count]);
  useUpdateEffect(() => {
    console.log(`update effect, count: ${count}`);
  }, [count]);
  return (
    <span>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +1
      </button>
    </span>
  );
};

ReactDom.render(<App />, document.getElementById('app'));
