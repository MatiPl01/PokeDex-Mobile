export const catchAsync =
  (fn: (...args: any[]) => void) =>
  (...args: any[]) => {
    try {
      return fn(...args);
    } catch (err) {
      console.error(err.message);
    }
  };
