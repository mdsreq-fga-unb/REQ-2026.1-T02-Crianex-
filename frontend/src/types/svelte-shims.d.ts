declare module '*.svelte' {
  import { SvelteComponentTyped } from 'svelte';

  export default class Component<Props = any> extends SvelteComponentTyped<Props> {}

  // Project-specific named exports commonly used in components
  export type ButtonProps = any;
  export type ButtonSize = any;
  export type ButtonVariant = any;
  export const buttonVariants: any;
  export const cn: any;
  export const tv: any;
  export type WithElementRef<T = any> = T;
}

export {};
