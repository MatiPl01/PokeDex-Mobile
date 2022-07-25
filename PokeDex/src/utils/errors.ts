import { AxiosError } from 'axios';

// A - argument types, R -  return type
export const catchAsync =
  <A, R>(fn: (...args: A[]) => R) =>
  async (...args: A[]) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.error((err as Error).message);
    }
  };

export const catchThrowAxiosError =
  <A, R>(fn: (...args: A[]) => R) =>
  async (...args: A[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const err = error as AxiosError;
      console.error(AxiosError);
      throw new Error(err.message);
    }
  };
