import { useRef, useEffect } from 'react';

const usePrevious = (value) => {
  const previousRef = useRef();
  useEffect(() => {
    previousRef.current = value;
  });

  return previousRef.current;
};

export default usePrevious;
