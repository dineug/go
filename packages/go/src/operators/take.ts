import { Channel } from '@/channel';

export const take = <T = any>(channel: Channel<T>) =>
  new Promise<T>(resolve => channel.take(resolve));
