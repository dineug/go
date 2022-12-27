import { EffectType } from '@/constants';
import type { AnyCallback, Effect } from '@/effects';
import { isFunction, isIterator, isObject, isPromise } from '@/is-type';

export type CompositionGenerator<T> =
  | Generator<T | Generator<T>>
  | AsyncGenerator<T | AsyncGenerator<T>>;

export type CoroutineCreator = () => CompositionGenerator<
  Effect | Promise<any> | Function
>;

export type CO = CoroutineCreator;

export async function routine(callback: AnyCallback, ...args: any[]) {
  const co = callback(...args);
  if (!isIterator(co)) return co;

  let result = await co.next();
  let value;

  while (!result.done) {
    if (isPromise(result.value)) {
      value = await result.value;
    } else if (isFunction(result.value)) {
      value = await routine(result.value);
    } else if (isIterator(result.value)) {
      value = await routine(() => result.value);
    } else if (isObject(result.value)) {
      const effect: Effect = result.value;

      switch (effect.type) {
        case EffectType.take:
          value = await new Promise<any>(resolve =>
            effect.channel.take(resolve)
          );
          break;
        case EffectType.put:
          effect.channel.put(effect.value);
          break;
        case EffectType.call:
          value = await routine(effect.callback, ...effect.args);
          break;
        case EffectType.fork:
          routine(effect.callback, ...effect.args);
          break;
      }
    }

    result = await co.next(value);
    value = undefined;
  }

  return result.value;
}
