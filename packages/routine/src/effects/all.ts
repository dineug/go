import { go } from '@/routine';

export const all = (values: any[]) =>
  Promise.all(values.map(value => go(() => value)));
