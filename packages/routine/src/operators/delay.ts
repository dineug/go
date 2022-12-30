import { go } from '@/routine';

export const delay = (ms: number) =>
  go(() => new Promise(resolve => window.setTimeout(resolve, ms)));
