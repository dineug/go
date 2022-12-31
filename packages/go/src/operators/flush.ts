import { Channel } from '@/channel';

export const flush = <T = any>(channel: Channel<T>) =>
  new Promise<Array<T>>(resolve => channel.flush(resolve));
