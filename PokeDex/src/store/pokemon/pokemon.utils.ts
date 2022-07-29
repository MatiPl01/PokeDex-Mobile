// Pokemon ids in the API are subsequent numbers starting from 1 stored as strings 
export const idToIdx = (id: string): number => +id - 1;

export const idxToId = (idx: number): string => String(idx + 1);
