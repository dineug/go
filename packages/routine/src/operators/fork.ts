import type { AnyCallback } from '@/operators';
import { go } from '@/routine';

export const fork = <F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
) => {
  go(callback, ...args);
};
