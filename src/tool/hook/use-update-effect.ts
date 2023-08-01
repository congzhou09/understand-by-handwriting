import { useEffect, useRef } from 'react';

const useUpdateEffect: typeof useEffect = (effectFun, deps) => {
  const hasMounted = useRef(false);
  useEffect(() => {
    return () => {
      hasMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
    } else {
      effectFun && effectFun();
    }
  }, deps);
};

export default useUpdateEffect;
