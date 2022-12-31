import { go } from '@/go';

export const delay = (ms: number) =>
  go(() => new Promise(resolve => window.setTimeout(resolve, ms)));
