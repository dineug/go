import { Channel } from '@/channel';
import type { EffectType } from '@/constants';

export type AnyCallback = (...args: any[]) => any;
export type Effect = TakeEffect | PutEffect | CallEffect | ForkEffect;

export type TakeEffect<T = any> = {
  type: EffectType.take;
  channel: Channel<T>;
};

export type PutEffect<T = any> = {
  type: EffectType.put;
  channel: Channel<T>;
  value: T;
};

export type CallEffect<F extends AnyCallback = AnyCallback> = {
  type: EffectType.call;
  callback: F;
  args: Parameters<F>;
};

export type ForkEffect<F extends AnyCallback = AnyCallback> = {
  type: EffectType.fork;
  callback: F;
  args: Parameters<F>;
};
