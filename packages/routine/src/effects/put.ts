import { Channel } from '@/channel';
import { EffectType } from '@/constants';
import type { PutEffect } from '@/effects';

export const put = <T = any>(channel: Channel<T>, value: T): PutEffect<T> => ({
  type: EffectType.put,
  channel,
  value,
});
