// A - argument types, R - return type
export const catchThrowAsync =
  <A, R>(fn: (...args: A[]) => R) =>
  async (...args: A[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const err = error as Error;
      console.error(err);
      throw new Error(err.message);
    }
  };
