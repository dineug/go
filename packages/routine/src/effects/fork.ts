import type { AnyCallback } from '@/effects';
import { go } from '@/routine';

export const fork = <F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
) => {
  go(callback, ...args);
};
