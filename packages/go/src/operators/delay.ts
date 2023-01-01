import { type PromiseWithCancel, go } from '@/go';

export const delay = (ms: number): PromiseWithCancel<void> =>
  go(() => new Promise(resolve => window.setTimeout(resolve, ms)));
