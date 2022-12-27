import type { ChannelBuffer } from '@/buffers';
import { LimitBuffer } from '@/buffers/limitBuffer';

export type Observer<T = any> = (value: T) => void;

export class Channel<T = any> {
  #buffer: ChannelBuffer<T>;
  #observers: ChannelBuffer<Observer<T>> = new LimitBuffer();
  #closed = false;

  get closed() {
    return this.#closed;
  }

  constructor(buffer: ChannelBuffer<T> = new LimitBuffer()) {
    this.#buffer = buffer;
  }

  put(value: T) {
    if (this.#closed) return;

    this.#buffer.put(value);
    this.#notify();
  }

  take(observer: (value: T) => void) {
    if (this.#closed) return;

    this.#observers.put(observer);
    this.#notify();
  }

  close() {
    this.#closed = true;
  }

  #notify() {
    if (this.#observers.isEmpty() || this.#buffer.isEmpty()) {
      return;
    }

    const observer = this.#observers.take();
    const value = this.#buffer.take();
    observer?.(value!);
  }
}
