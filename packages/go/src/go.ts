import {
  isArray,
  isFunction,
  isIterator,
  isOperator,
  isPromiseLike,
} from '@/is-type';
import { type AnyCallback, CANCEL, cancel, isCancel } from '@/operators';

export type CompositionGenerator<T> =
  | Generator<T | CompositionGenerator<T>>
  | AsyncGenerator<T | CompositionGenerator<T>>;

export type PromiseWithCancel<T = any> = Promise<T> & {
  cancel(): PromiseWithCancel<T>;
};

export type CompositionPromise<T = any> =
  | Promise<T>
  | PromiseLike<T>
  | PromiseWithCancel<T>;

export type CoroutineCreator = (
  ...args: any[]
) => CompositionGenerator<
  CompositionPromise<any> | Function | Array<any> | void
>;

export type CO = CoroutineCreator;

export function go<F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
): PromiseWithCancel<any> {
  let canceled = false;
  let cancelAndReject: AnyCallback | null = null;

  const promise = new Promise(async (resolve, reject) => {
    let process: Array<CompositionPromise<any>> | null = null;
    cancelAndReject = () => {
      reject(CANCEL);
      process?.forEach(cancel);
      process = null;
    };

    try {
      const co = callback(...args);
      if (isPromiseLike(co)) {
        process = [co];
        return resolve(await co);
      } else if (!isIterator(co)) {
        return resolve(co);
      }

      let result = await co.next();
      let value;

      while (!canceled && !result.done) {
        if (isOperator(result.value)) {
          const next = toNext(result.value);
          process = isArray(next) ? next : [next];
          value = await (isArray(next) ? Promise.all(next) : next);
        }

        result = await co.next(value);
        value = undefined;
        process = null;
      }

      resolve(result.value);
    } catch (error) {
      if (isCancel(error)) {
        canceled = true;
      }
      reject(error);
    }
  }) as PromiseWithCancel;

  promise.cancel = () => {
    canceled = true;
    cancelAndReject?.();
    return promise;
  };

  return promise;
}

function toNext(value: any) {
  return isPromiseLike(value)
    ? value
    : isIterator(value)
    ? go(() => value)
    : isFunction(value)
    ? go(value)
    : isArray(value)
    ? value.map(value => go(() => value))
    : Promise.resolve();
}
