import { Channel } from '@/channel';
import { cancel } from '@/operators/cancel';
import { take } from '@/operators/take';
import { type PromiseWithCancel, go } from '@/routine';

export const takeLatest = <
  T = any,
  F extends (value: T) => any = (value: T) => any
>(
  channel: Channel<T>,
  callback: F
) => {
  go(function* () {
    let lastTask: PromiseWithCancel | undefined;

    while (true) {
      const value: any = yield take(channel);
      cancel(lastTask);
      // @ts-ignore
      lastTask = go(callback, value);
    }
  });
};
