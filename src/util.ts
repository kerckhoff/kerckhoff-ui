/**
 * Check if status code is success. (20X)
 * @param status status code
 */
export const isStatusSuccess = (status: number) => ~~(status / 100) === 2;
