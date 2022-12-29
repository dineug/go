export const delay = (ms: number) =>
  new Promise(resolve => window.setTimeout(resolve, ms));
