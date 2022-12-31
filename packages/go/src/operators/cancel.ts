import { type CompositionPromise } from '@/go';
import { isPromiseWithCancel } from '@/is-type';

export const CANCEL = Symbol.for(
  'https://github.com/dineug/routine.git#cancel'
);

export const isCancel = (value: any): value is typeof CANCEL =>
  value === CANCEL;

export const cancel = <T>(promise: CompositionPromise<T>) => {
  isPromiseWithCancel(promise) && promise.cancel();
};
