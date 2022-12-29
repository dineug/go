import { type LimitBufferConfig, LimitBuffer } from '@/buffers/limitBuffer';

const limitBuffer = <T = any>(config?: LimitBufferConfig) =>
  new LimitBuffer<T>(config);

export const buffers = {
  limitBuffer,
} as const;
