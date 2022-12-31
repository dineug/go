export const KILL = Symbol.for('https://github.com/dineug/routine.git#kill');

export const isKill = (value: any): value is typeof KILL => value === KILL;

export const kill = () => Promise.reject(KILL);
