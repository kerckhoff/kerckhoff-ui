/**
 * Check if status code is success. (20X)
 * @param status status code
 */
export const isStatusSuccess = (status: number) => ~~(status / 100) === 2;

interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
  reject: () => void;
}

export function deferred(): Deferred {
  let resolve: () => void | undefined, reject: () => void | undefined;
  const promise: Promise<void> = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
}
