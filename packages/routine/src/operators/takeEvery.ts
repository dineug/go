import { type TakeCallback, Channel } from '@/channel';
import { take } from '@/operators/take';
import { go } from '@/routine';

export const takeEvery = <T = any, F extends TakeCallback<T> = TakeCallback<T>>(
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
