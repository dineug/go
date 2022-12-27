import { call, Channel, CO, fork, put, routine, take } from '@/index';

const inputChannel = new Channel();
const outputChannel = new Channel();

const foo: CO = function* () {
  console.log('coroutine start');
  const value = yield take(inputChannel);
  console.log('coroutine take:value', value);
  const value2 = yield call((v: any) => v, value);
  console.log('coroutine call:value', value2);
  yield put(outputChannel, 1234);

  const value3 = yield call(function* () {
    const value: any = yield take(inputChannel);
    console.log('coroutine call:take:value', value);
    yield value;
    return 123;
  });

  console.log('coroutine call:take:return:value', value3);

  yield fork(function* () {
    const value = yield take(inputChannel);
    console.log('coroutine fork:take:value', value);
  });

  const value4 = yield Promise.resolve(5);
  console.log('Promise:value', value4);

  const value5 = yield function* (): Generator<any> {
    const value = yield take(inputChannel);
    console.log('generator function:take:value', value);
    return 1234;
  };
  console.log('generator function:value', value5);

  const value6 = yield function () {
    return 12345;
  };
  console.log('function:value', value6);

  const value7 = yield (function* (): Generator<any> {
    const value = yield take(inputChannel);
    console.log('generator:take:value', value);
    return 123456;
  })();
  console.log('generator:value', value7);

  const value8 = yield call(async function () {
    return 1234567;
  });
  console.log('async function:value', value8);
};

inputChannel.put(1);
inputChannel.put(2);
inputChannel.put(3);
inputChannel.put(4);
inputChannel.put(5);
inputChannel.put(6);
inputChannel.put(7);
inputChannel.put(8);
inputChannel.put(9);
inputChannel.put(10);

routine(foo);
routine(foo);

outputChannel.take(value => {
  console.log('outputChannel1', value);
});

outputChannel.take(value => {
  console.log('outputChannel2', value);
});
