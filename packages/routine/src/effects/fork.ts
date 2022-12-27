import { EffectType } from '@/constants';
import type { AnyCallback, ForkEffect } from '@/effects';

export const fork = <F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
): ForkEffect<F> => ({
  type: EffectType.fork,
  callback,
  args,
});
