import { EffectType } from '@/constants';
import type { AnyCallback, CallEffect } from '@/effects';

export const call = <F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
): CallEffect<F> => ({
  type: EffectType.call,
  callback,
  args,
});
