import { go } from '@/routine';

export const all = <T extends readonly unknown[] | []>(values: T) =>
  Promise.all<T>(values.map(value => go(() => value)));
