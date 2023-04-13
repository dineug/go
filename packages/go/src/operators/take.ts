import { Channel } from '@/channel';
import { go, type PromiseWithCancel } from '@/go';

export const take = <T = any>(channel: Channel<T>) =>
  go(function* () {
    let drop = () => false;

    const promise = new Promise<T>((resolve, reject) => {
      drop = channel.take(resolve, reject);
    }) as PromiseWithCancel<T>;

    promise.cancel = () => {
      drop();
      return promise;
    };

    const value: T = yield promise;
    return value;
  });
