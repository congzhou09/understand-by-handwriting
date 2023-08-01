import { useEffect, useRef } from 'react';

const useMountEffect: typeof useEffect = (effectFun, deps) => {
  const hasMounted = useRef(false);
  useEffect(() => {
    return () => {
      hasMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      effectFun && effectFun();
    }
  }, deps);
};

export default useMountEffect;
