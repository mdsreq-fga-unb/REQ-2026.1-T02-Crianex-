export { cn } from './utils/index.js';

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

export type WithoutChild<T> = Omit<T, 'child'>;
export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;
