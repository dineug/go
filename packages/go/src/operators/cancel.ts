import { type CompositionPromise, go } from '@/go';
import { isPromiseWithCancel } from '@/is-type';

export const CANCEL = Symbol.for('https://github.com/dineug/go.git#cancel');

export const isCancel = (value: any): value is typeof CANCEL =>
  value === CANCEL;

export const cancel = <T>(promise?: CompositionPromise<T>) => {
  isPromiseWithCancel(promise) && promise.cancel();

  return go(
    () =>
      new Promise<void>((resolve, reject) =>
        promise ? resolve() : reject(CANCEL)
      )
  );
};
