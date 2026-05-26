<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let className: string | undefined = undefined;
  export let variant: string = 'default';
  export let size: string = 'default';
  export let builders: any[] = [];

  export { className as class };
</script>

<button
  {...$$restProps}
  class={className}
  data-variant={variant}
  data-size={size}
  data-builders={builders.length}
  on:click={(e) => dispatch('click', e)}
  on:keydown={(e) => dispatch('keydown', e)}
>
  <slot />
</button>
