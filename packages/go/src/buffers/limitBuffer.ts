import type { ChannelBuffer } from '@/buffers/type';

export type LimitBufferConfig = Partial<{
  limit: number;
  leading: boolean;
  trailing: boolean;
}>;

const defaultConfig: Required<LimitBufferConfig> = {
  limit: -1,
  leading: false,
  trailing: false,
};

export class LimitBuffer<T = any> implements ChannelBuffer<T> {
  #queue: Array<T> = [];
  #config: Required<LimitBufferConfig>;

  constructor(config?: LimitBufferConfig) {
    this.#config = Object.assign({}, defaultConfig, {
      ...config,
    });
  }

  isEmpty(): boolean {
    return !this.#queue.length;
  }

  put(value: T) {
    this.#queue.push(value);
    this.#drop();
  }

  take(): T | undefined {
    return this.#queue.shift();
  }

  flush(): Array<T> {
    const queue = this.#queue;
    this.#queue = [];
    return queue;
  }

  #drop() {
    if (this.#config.limit === -1) return;

    if (this.#config.limit < this.#queue.length) {
      this.#config.trailing
        ? this.#queue.pop()
        : this.#config.leading
        ? this.#queue.shift()
        : this.#queue.pop();
    }
  }
}
