export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Complete<T> = WithRequired<T, keyof T>;
