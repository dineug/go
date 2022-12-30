import { isPromiseWithCancel } from '@/is-type';
import { type CompositionPromise, type PromiseWithCancel, go } from '@/routine';

export const CANCEL = Symbol.for(
  'https://github.com/dineug/routine.git#cancel'
);

export const isCancel = (value: any): value is typeof CANCEL =>
  value === CANCEL;

export const cancel = <T>(
  promise?: CompositionPromise<T>
): PromiseWithCancel<void> => {
  isPromiseWithCancel(promise) && promise.cancel();

  return go(
    () =>
      new Promise<void>((resolve, reject) =>
        promise ? resolve() : reject(CANCEL)
      )
  );
};
