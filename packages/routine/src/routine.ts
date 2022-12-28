import type { AnyCallback } from '@/effects';
import { isArray, isFunction, isIterator, isPromise } from '@/is-type';

export type CompositionGenerator<T> =
  | Generator<T | Generator<T>>
  | AsyncGenerator<T | AsyncGenerator<T>>;

type CompositionPromise<T> = Promise<T> | PromiseLike<T>;

export type CoroutineCreator = (
  ...args: any[]
) => CompositionGenerator<
  CompositionPromise<any> | Function | Array<any> | void
>;

export type CO = CoroutineCreator;

export async function routine<F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
) {
  const co = callback(...args);
  if (!isIterator(co)) return co;

  let result = await co.next();
  let value;

  while (!result.done) {
    if (isPromise(result.value)) {
      value = await result.value;
    } else if (isIterator(result.value)) {
      value = await routine(() => result.value);
    } else if (isFunction(result.value)) {
      value = await routine(result.value);
    } else if (isArray(result.value)) {
      value = await Promise.all(
        result.value.map(value => routine(() => value))
      );
    }

    result = await co.next(value);
    value = undefined;
  }

  return result.value;
}
