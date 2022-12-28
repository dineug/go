import { all, call, Channel, CO, fork, put, routine, take } from '@/index';

const inputChannel = new Channel();
const outputChannel = new Channel();

const foo: CO = function* () {
  console.log('start');
  const value = yield take(inputChannel);
  console.log('take:value', value);
  const value2 = yield call((v: any) => v, value);
  console.log('call:value', value2);
  yield put(outputChannel, 1234);

  yield fork(function* () {
    const value = yield take(inputChannel);
    console.log('fork:take:value', value);
  });

  const values = yield all([
    call(() => 1),
    fork(() => 2),
    Promise.resolve(3),
    Promise.resolve(4),
    5,
    6,
    take(inputChannel),
    take(inputChannel),
  ]);
  console.log('all:values', values);
};

for (let i = 0; i < 20; i++) {
  inputChannel.put(i);
}

routine(foo);

outputChannel.take(value => {
  console.log('outputChannel', value);
});
