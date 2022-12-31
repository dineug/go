import { type ChannelBuffer, buffers } from '@/buffers';

export type TakeCallback<T = any> = (value: T) => any;

export class Channel<T = any> {
  #buffer: ChannelBuffer<T>;
  #callbackBuffer: ChannelBuffer<TakeCallback<T>> = buffers.limitBuffer();
  #closed = false;

  get closed() {
    return this.#closed;
  }

  constructor(buffer: ChannelBuffer<T> = buffers.limitBuffer()) {
    this.#buffer = buffer;
  }

  put(value: T) {
    if (this.#closed) return;

    this.#buffer.put(value);
    this.#notify();
  }

  take(callback: TakeCallback<T>) {
    if (this.#closed) return;

    this.#callbackBuffer.put(callback);
    this.#notify();
  }

  flush(callback: (values: Array<T>) => void) {
    if (this.#closed) return;

    callback(this.#buffer.flush());
  }

  close() {
    this.#closed = true;
  }

  #notify() {
    if (this.#callbackBuffer.isEmpty() || this.#buffer.isEmpty()) {
      return;
    }

    const callback = this.#callbackBuffer.take();
    const value = this.#buffer.take();
    callback?.(value as T);
  }
}

export const channel = <T = any>(buffer?: ChannelBuffer<T>) =>
  new Channel(buffer);
