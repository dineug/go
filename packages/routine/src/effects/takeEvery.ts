import { Channel } from '@/channel';
import { take } from '@/effects/take';
import { go } from '@/routine';

export const takeEvery = <
  T = any,
  F extends (value: T) => any = (value: T) => any
>(
  channel: Channel<T>,
  callback: F
) => {
  go(function* () {
    while (true) {
      const value = yield take(channel);
      // @ts-ignore
      go(callback, value);
    }
  });
};
