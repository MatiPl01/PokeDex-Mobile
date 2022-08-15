export const areSetsEqual = <T>(set1: Set<T>, set2: Set<T>): boolean => {
  return set1.size === set2.size && [...set1].every(x => set2.has(x));
};

export const haveArraysTheSameElements = <T>(arr1: T[], arr2: T[]): boolean => {
  return (
    arr1.length === arr2.length && areSetsEqual(new Set(arr1), new Set(arr2))
  );
};
