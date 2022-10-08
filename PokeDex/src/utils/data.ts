export const cloneObj = <T extends object>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const lowerCase = <T extends string>(value: T): Lowercase<T> =>
  value.toLowerCase() as Lowercase<T>;

export const idToIdx = (id: string): number => +id - 1;

export const idxToId = (idx: number): string => String(idx + 1);
