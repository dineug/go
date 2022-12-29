import { Channel } from '@/channel';
import { take } from '@/effects/take';
import { go } from '@/routine';

export const takeLeading = <
  T = any,
  F extends (value: T) => any = (value: T) => any
>(
  channel: Channel<T>,
  callback: F
) => {
  go(function* () {
    let executable = true;

    while (true) {
      const value: any = yield take(channel);

      if (executable) {
        executable = false;
        // @ts-ignore
        go(callback, value).finally(() => {
          executable = true;
        });
      }
    }
  });
};
