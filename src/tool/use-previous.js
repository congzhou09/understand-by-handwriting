import { useRef, useEffect } from "react";

const usePrevious = (value) => {
  let previousRef = useRef();
  useEffect(() => {
    previousRef.current = value;
  });

  return previousRef.current;
};

export default usePrevious;
