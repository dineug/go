import type { AnyCallback } from '@/effects';
import { isArray, isFunction, isIterator, isPromiseLike } from '@/is-type';

export type CompositionGenerator<T> =
  | Generator<T | CompositionGenerator<T>>
  | AsyncGenerator<T | CompositionGenerator<T>>;

type CompositionPromise<T> = Promise<T> | PromiseLike<T>;

export type CoroutineCreator = (
  ...args: any[]
) => CompositionGenerator<
  CompositionPromise<any> | Function | Array<any> | void
>;

export type CO = CoroutineCreator;

export async function go<F extends AnyCallback>(
  callback: F,
  ...args: Parameters<F>
): Promise<any> {
  const co = callback(...args);
  if (!isIterator(co)) return co;

  let result = await co.next();
  let value;

  while (!result.done) {
    if (isPromiseLike(result.value)) {
      value = await result.value;
    } else if (isIterator(result.value)) {
      value = await go(() => result.value);
    } else if (isFunction(result.value)) {
      value = await go(result.value);
    } else if (isArray(result.value)) {
      value = await Promise.all(result.value.map(value => go(() => value)));
    }

    result = await co.next(value);
    value = undefined;
  }

  return result.value;
}
