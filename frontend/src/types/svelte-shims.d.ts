// Fallback ambient declarations for .svelte files when svelte-check is not used.
// SvelteComponentTyped was removed in Svelte 5 — use plain `any` default export instead.
// NOTE: this file must NOT contain top-level import/export — wildcard declare module
// only works in script-mode .d.ts files (not module-mode).
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svelte' {
  const component: any;
  export default component;
  // Named exports used by src/lib/components/ui/button
  export type ButtonProps = any;
  export type ButtonSize = any;
  export type ButtonVariant = any;
  export const buttonVariants: any;
  export const cn: any;
  export const tv: any;
  export type WithElementRef<T = any> = T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
