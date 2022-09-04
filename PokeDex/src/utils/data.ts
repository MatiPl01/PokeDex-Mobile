export const areSetsEqual = <T>(set1: Set<T>, set2: Set<T>): boolean => {
  return set1.size === set2.size && [...set1].every(x => set2.has(x));
};

export const haveArraysTheSameElements = <T>(arr1: T[], arr2: T[]): boolean => {
  return (
    arr1.length === arr2.length && areSetsEqual(new Set(arr1), new Set(arr2))
  );
};

export const cloneObj = <T extends object>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const lowerCase = <T extends string>(value: T): Lowercase<T> =>
  value.toLowerCase() as Lowercase<T>;
