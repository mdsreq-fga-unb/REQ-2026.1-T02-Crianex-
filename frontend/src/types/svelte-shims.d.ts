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

declare module './$types' {
  // Generic fallbacks for SvelteKit generated types used during typecheck in CI
  export type PageServerLoad = any;
  export type PageData = any;
  export type LayoutServerLoad = any;
  export type LayoutData = any;
}

export {};
