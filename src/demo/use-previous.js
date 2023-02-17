import { useState } from "react";
import ReactDom from "react-dom";
import usePrevious from "../tool/use-previous";

const App = () => {
  const [valueOne, setValueOne] = useState(0);
  const prevValueOne = usePrevious(valueOne);
  return (
    <div>
      <h2>usePrevious test</h2>
      <p>lastValue: {prevValueOne}</p>
      <p>currentValue: {valueOne}</p>
      <button
        onClick={() => {
          setValueOne(valueOne + 1);
        }}
      >
        值加1
      </button>
    </div>
  );
};

ReactDom.render(<App />, document.getElementById("app"));
