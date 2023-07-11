import deepEqual from 'deep-equal';
import { useRef } from 'react';

export const useDeepCompareMemoize = <T>(value: T) => {
  const ref = useRef<T>();
  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
};
