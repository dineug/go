import { isPromise } from '@/is-type';

type RaceRecord = Record<string, PromiseLike<any>>;
type AwaitedRecord<T extends RaceRecord, K extends keyof T = keyof T> = {
  [P in K]: Awaited<T[P]>;
};

export const race = (record: RaceRecord) =>
  new Promise<Partial<AwaitedRecord<RaceRecord>>>(resolve => {
    for (const [key, promise] of Object.entries(record)) {
      isPromise(promise)
        ? promise.then(value => resolve({ [key]: value }))
        : resolve({ [key]: promise });
    }
  });
