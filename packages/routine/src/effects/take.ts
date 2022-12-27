import { Channel } from '@/channel';
import { EffectType } from '@/constants';
import type { TakeEffect } from '@/effects';

export const take = <T = any>(channel: Channel<T>): TakeEffect<T> => ({
  type: EffectType.take,
  channel,
});
