import { go } from '@/go';
import type { AnyCallback } from '@/operators';

export const fork = <F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
) => {
  go(callback, ...args);
};
