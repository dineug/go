import { go } from '@/go';

export const delay = (ms: number) =>
  go(() => new Promise<void>(resolve => window.setTimeout(resolve, ms)));
