import type { AnyCallback } from '@/effects';
import { routine } from '@/routine';

export const fork = <F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
) => {
  routine(callback, ...args);
};
